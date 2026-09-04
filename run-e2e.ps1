<#
.SYNOPSIS
    OmniQA Unified Polyglot End-to-End Master Pipeline Runner
.DESCRIPTION
    Executes the 15-step hybrid integrated test automation pipeline in chronological order:
    - Steps 01 to 13: Integrated Web UI, API Contracts & DB Checks
    - Steps 14 & 15: JMeter Load Simulation & Performance SLA Benchmark
    Supports multi-environment execution (qa, dev, staging, prod) and parallel workers via config/environments.json.
#>

param (
    [ValidateSet("qa", "dev", "staging", "prod")]
    [string]$Env = "qa",
    [switch]$SkipPerformance = $false,
    [switch]$Headed = $false,
    [switch]$Parallel = $false,
    [switch]$CrossBrowser = $false,
    [int]$Workers = 0,
    [string]$Browser = "chromium",
    [string]$Spec = ""
)

$ErrorActionPreference = "Continue"

$projectRoot = $PSScriptRoot
$mvnCmd = if (Get-Command "mvn" -ErrorAction SilentlyContinue) { "mvn" } elseif (Test-Path "C:\Users\USER\.m2\apache-maven-3.9.6\bin\mvn.cmd") { "C:\Users\USER\.m2\apache-maven-3.9.6\bin\mvn.cmd" } else { "mvn" }
$startTime = Get-Date
$sessionTimestamp = Get-Date -Format 'yyyyMMdd_HHmmss'
$sessionTag = "report_$sessionTimestamp"

# -------------------------------------------------------------------------
# LOAD MULTI-ENVIRONMENT CONFIGURATION FROM config/environments.json
# -------------------------------------------------------------------------
$configPath = Join-Path $projectRoot "config\environments.json"
if (Test-Path $configPath) {
    try {
        $envsJson = Get-Content $configPath -Raw | ConvertFrom-Json
        $activeConfig = $envsJson.environments.$Env
        if (-not $activeConfig -and $envsJson.defaultEnv) {
            $activeConfig = $envsJson.environments.($envsJson.defaultEnv)
        }

        if ($activeConfig) {
            if ($activeConfig.baseUrl) { $env:BASE_URL = $activeConfig.baseUrl }
            if ($activeConfig.apiBaseUrl) { $env:API_BASE_URL = $activeConfig.apiBaseUrl }
            if ($activeConfig.apiPath) { $env:API_PATH = $activeConfig.apiPath }
            if ($activeConfig.retries -ne $null) { $env:RETRIES = "$($activeConfig.retries)" }
            if ($activeConfig.parallelWorkers -ne $null) { $env:PARALLEL_WORKERS = "$($activeConfig.parallelWorkers)" }
            if ($activeConfig.auth -and $activeConfig.auth.username) { $env:TEST_USERNAME = $activeConfig.auth.username }
            if ($activeConfig.auth -and $activeConfig.auth.password) { $env:TEST_PASSWORD = $activeConfig.auth.password }
            if ($activeConfig.database -and $activeConfig.database.url) { $env:DB_URL = $activeConfig.database.url }
            if ($activeConfig.database -and $activeConfig.database.user) { $env:DB_USER = $activeConfig.database.user }
            if ($activeConfig.database -and $activeConfig.database.password -ne $null) { $env:DB_PASSWORD = $activeConfig.database.password }
            if ($activeConfig.performance -and $activeConfig.performance.host) { $env:PERF_HOST = $activeConfig.performance.host }
            if ($activeConfig.performance -and $activeConfig.performance.threads) { $env:PERF_THREADS = "$($activeConfig.performance.threads)" }
            if ($activeConfig.performance -and $activeConfig.performance.rampUp) { $env:PERF_RAMPUP = "$($activeConfig.performance.rampUp)" }
            if ($activeConfig.performance -and $activeConfig.performance.loops) { $env:PERF_LOOPS = "$($activeConfig.performance.loops)" }
            if ($activeConfig.timeouts -and $activeConfig.timeouts.element) { $env:TIMEOUT_ELEMENT = "$($activeConfig.timeouts.element)" }
            if ($activeConfig.timeouts -and $activeConfig.timeouts.pageLoad) { $env:TIMEOUT_PAGE_LOAD = "$($activeConfig.timeouts.pageLoad)" }
            if ($activeConfig.timeouts -and $activeConfig.timeouts.api) { $env:TIMEOUT_API = "$($activeConfig.timeouts.api)" }
            if ($activeConfig.headless -ne $null) { $env:HEADLESS = "$($activeConfig.headless)" }
        }
    } catch {
        Write-Warning "Could not parse config/environments.json: $_"
    }
}

$env:TEST_ENV = $Env
$targetUrl = if ($env:BASE_URL) { $env:BASE_URL } else { "https://www.bstackdemo.com" }

# Parallel worker configuration
$activeWorkers = if ($Workers -gt 0) { $Workers } elseif ($Parallel) { [int]$env:PARALLEL_WORKERS } else { 1 }
if ($Parallel -or $Workers -gt 1) {
    $env:PARALLEL = "true"
    $env:WORKERS = "$activeWorkers"
}

# Ensure reports directories exist
$reportDirs = @("reports\db", "reports\api", "reports\html", "reports\perf", "reports\screenshots", "reports\logs", "reports\excel")
foreach ($dir in $reportDirs) {
    $fullPath = Join-Path $projectRoot $dir
    if (-not (Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
    }
}

# Pass dynamic timestamped folders to all tools
$env:HTML_REPORT_DIR = "reports/html/$sessionTag"
$env:SCREENSHOT_DIR = "reports/screenshots/$sessionTag"
$env:LOG_DIR = "reports/logs/$sessionTag"
$env:EXCEL_REPORT_DIR = "reports/excel/$sessionTag"
$env:SESSION_TAG = "$sessionTag"

$modeDisplay = if ($Parallel -or $Workers -gt 1) { "PARALLEL (Workers: $activeWorkers)" } else { "SEQUENTIAL" }

# Multi-Browser / Cross-Browser Resolution
$selectedBrowsers = @()
if ($CrossBrowser -or $Browser -eq "all" -or $Browser -eq "cross-browser") {
    $selectedBrowsers = @("chromium", "firefox", "webkit")
} elseif ($Browser -eq "mobile") {
    $selectedBrowsers = @("mobile-chrome", "mobile-safari")
} elseif ($Browser.Contains(",")) {
    $selectedBrowsers = $Browser.Split(',') | ForEach-Object { $_.Trim() } | Where-Object { $_ }
} else {
    $selectedBrowsers = @($Browser)
}
$browserDisplay = $selectedBrowsers -join ", "

Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "       OMNIQA POLYGLOT FRAMEWORK - 15-STEP MASTER PIPELINE                 " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "Timestamp:   $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
Write-Host "Session:     $sessionTag" -ForegroundColor Gray
Write-Host "Environment: $(($Env).ToUpper())" -ForegroundColor Yellow
Write-Host "Execution:   $modeDisplay | Browser(s): $browserDisplay" -ForegroundColor Yellow
Write-Host "Target URL:  $targetUrl" -ForegroundColor Gray
Write-Host "--------------------------------------------------------------------------"

# -------------------------------------------------------------------------
# STAGE 1: REAL-TIME 13-STEP INTEGRATED JOURNEY (Web UI + API + DB)
# -------------------------------------------------------------------------
$stepStart = Get-Date
$playwrightArgs = @("playwright", "test")

if ($Spec) {
    $playwrightArgs += $Spec
}
if ($Headed) { 
    $playwrightArgs += "--headed" 
}
foreach ($b in $selectedBrowsers) {
    $playwrightArgs += "--project=$b"
}
if ($Parallel) {
    $playwrightArgs += "--fully-parallel"
    $playwrightArgs += "--workers=$activeWorkers"
} elseif ($Workers -gt 0) {
    $playwrightArgs += "--workers=$Workers"
}

# Real-time streaming line-by-line
& npx @playwrightArgs

$journeySuccess = ($LASTEXITCODE -eq 0)
$journeyDuration = [math]::Round(((Get-Date) - $stepStart).TotalSeconds, 2)

# Generate Java Surefire & TestNG Reports for API & DB with session timestamp
$apiReportPath = Join-Path $projectRoot "reports\api\$sessionTag"
$dbReportPath = Join-Path $projectRoot "reports\db\$sessionTag"

$mavenParallelArgs = @()
if ($Parallel) {
    $mavenParallelArgs += "-Dparallel=methods"
    $mavenParallelArgs += "-DthreadCount=$activeWorkers"
}

$apiStart = Get-Date
& $mvnCmd test "-Denv=$Env" "-Dtest=ProductsApiTest" "-Dsurefire.reportsDirectory=$apiReportPath" @mavenParallelArgs 2>&1 | Out-Null
$apiSuccess = ($LASTEXITCODE -eq 0)
$apiDuration = [math]::Round(((Get-Date) - $apiStart).TotalSeconds, 2)

$dbStart = Get-Date
& $mvnCmd test "-Denv=$Env" "-Dtest=DatabaseIntegrityTest" "-Dsurefire.reportsDirectory=$dbReportPath" 2>&1 | Out-Null
$dbSuccess = ($LASTEXITCODE -eq 0)
$dbDuration = [math]::Round(((Get-Date) - $dbStart).TotalSeconds, 2)

# -------------------------------------------------------------------------
# STAGE 2: PERFORMANCE & SLA BENCHMARK (Steps 14 & 15 via Apache JMeter)
# -------------------------------------------------------------------------
$perfSuccess = $true
$perfDuration = 0
if (-not $SkipPerformance) {
    $stepStart = Get-Date
    $perfScript = Join-Path $projectRoot "performance\scripts\run-performance.ps1"
    & powershell -ExecutionPolicy Bypass -File $perfScript -Timestamp $sessionTimestamp
    $perfSuccess = ($LASTEXITCODE -eq 0)
    $perfDuration = [math]::Round(((Get-Date) - $stepStart).TotalSeconds, 2)
}

# -------------------------------------------------------------------------
# STAGE 3: AUTOMATED MULTI-SHEET EXCEL REPORT GENERATION (.xlsx)
# -------------------------------------------------------------------------
$excelScript = Join-Path $projectRoot "web\src\reporting\excelReporter.ts"
if (Test-Path $excelScript) {
    & npx ts-node $excelScript --session $sessionTag --env $Env 2>&1 | Out-Null
}

# -------------------------------------------------------------------------
# CONSOLIDATED SUMMARY REPORT & REPORT PATHS
# -------------------------------------------------------------------------
$totalDuration = [math]::Round(((Get-Date) - $startTime).TotalSeconds, 2)

Write-Host "`n==========================================================================" -ForegroundColor Cyan
Write-Host "             OMNIQA 15-STEP CHRONOLOGICAL PIPELINE SUMMARY                " -ForegroundColor Cyan
Write-Host "==========================================================================" -ForegroundColor Cyan
Write-Host "Environment: $(($Env).ToUpper()) | Mode: $modeDisplay | Target: $targetUrl" -ForegroundColor Yellow

$statusWeb = if ($journeySuccess) { "PASSED" } else { "FAILED" }
$statusApi = if ($apiSuccess) { "PASSED" } else { "FAILED" }
$statusDb = if ($dbSuccess) { "PASSED" } else { "FAILED" }
$statusPerf = if ($perfSuccess) { "PASSED" } else { "FAILED" }

$colorWeb = if ($journeySuccess) { "Green" } else { "Red" }
$colorApi = if ($apiSuccess) { "Green" } else { "Red" }
$colorDb = if ($dbSuccess) { "Green" } else { "Red" }
$colorPerf = if ($perfSuccess) { "Green" } else { "Red" }

Write-Host ("{0,-39} | {1,-24} | {2,7}" -f "TEST KATMANI & ADIMLAR", "ARAC & PROGRAMLAMA DILI", "DURUM") -ForegroundColor DarkCyan
Write-Host "--------------------------------------------------------------------------"
Write-Host ("{0,-39} | {1,-24} | {2,7} ({3}s)" -f "Web UI Journey (Steps 1,2,3,7,10,13)", "Playwright (TypeScript)", $statusWeb, $journeyDuration) -ForegroundColor $colorWeb
Write-Host ("{0,-39} | {1,-24} | {2,7} ({3}s)" -f "API Contracts (Steps 4,5,8,11)", "REST Assured (Java)", $statusApi, $apiDuration) -ForegroundColor $colorApi
Write-Host ("{0,-39} | {1,-24} | {2,7} ({3}s)" -f "Database SQL Checks (Steps 6,9,12)", "H2 Database (Java/SQL)", $statusDb, $dbDuration) -ForegroundColor $colorDb
Write-Host ("{0,-39} | {1,-24} | {2,7} ({3}s)" -f "Performance Load & SLA (Steps 14,15)", "Apache JMeter", $statusPerf, $perfDuration) -ForegroundColor $colorPerf

Write-Host "--------------------------------------------------------------------------"
Write-Host "Total Execution Time: $totalDuration seconds" -ForegroundColor Cyan

Write-Host "`nTest Raporu Ciktilari (Session: $sessionTag | Env: $(($Env).ToUpper())):" -ForegroundColor Cyan
Write-Host "  * Excel Raporu (.xlsx): reports/excel/$sessionTag/OmniQA_Execution_Report.xlsx" -ForegroundColor Green
Write-Host "  * Web UI Raporu:      reports/html/$sessionTag/index.html" -ForegroundColor Gray
Write-Host "  * API Raporu:         reports/api/$sessionTag/index.html" -ForegroundColor Gray
Write-Host "  * DB Raporu:          reports/db/$sessionTag/index.html" -ForegroundColor Gray
Write-Host "  * Performance Raporu: reports/perf/$sessionTag/index.html" -ForegroundColor Gray
Write-Host "  * Execution Logs:     reports/logs/$sessionTag/execution.log" -ForegroundColor Gray

# Check for Failure Screenshots
$screenshotDir = Join-Path $projectRoot "reports\screenshots\$sessionTag"
$failureScreenshots = Get-ChildItem -Path $screenshotDir -Filter "*.png" -ErrorAction SilentlyContinue
if ($failureScreenshots) {
    Write-Host "`nHata Ekran Goruntuleri (Failure Screenshots):" -ForegroundColor Yellow
    foreach ($ss in $failureScreenshots) {
        Write-Host "  ! Ekran Goruntusu:    reports/screenshots/$sessionTag/$($ss.Name)" -ForegroundColor Yellow
    }
}

Write-Host "==========================================================================`n"

if ($journeySuccess -and $apiSuccess -and $dbSuccess -and $perfSuccess) {
    exit 0
} else {
    exit 1
}
