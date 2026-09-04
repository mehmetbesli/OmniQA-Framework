# OmniQA Framework

> **Multi-Language, Multi-Tool, Sustainable & Scalable Unified End-to-End Test Automation Framework**

OmniQA Framework is an enterprise-grade test automation framework that seamlessly unites **Web UI (Playwright + TypeScript)**, **API (REST Assured + Java)**, **Database (H2 Database + Java)**, and **Performance (Apache JMeter)** across clean top-level modular directories, runnable with a single command or individually.

---

## 🎯 Target Application Under Test (AUT)
- **Base URL:** [https://www.bstackdemo.com](https://www.bstackdemo.com)
- **Domain:** E-Commerce Platform (Smartphone Catalog, Shopping Cart, Authentication, Multi-step Checkout, Order History)

---

## ⚡ Paralel Koşu (Parallel Execution) Mimarisi

Framework, test yürütme süresini minimize etmek için tüm katmanlarda **çoklu iş parçacığı (Multi-Worker / Multi-Thread)** desteği sunar:

- **Web UI (Playwright):** `fullyParallel: true` ve dinamik `workers` (varsayılan: 3 worker) ile bağımsız tarayıcı izole ortamlarında testler eş zamanlı çalışır.
- **Cross-Browser Desteği:** `Chromium`, `Firefox`, `WebKit (Safari)`, `Mobile Chrome` ve `Mobile Safari` üzerinde paralel koşu matrisi.
- **API & DB (Java / TestNG):** `parallel="methods"` ve `threadCount="3"` ile API ve DB test metotları paralel thread'lerde koşturulur.
- **Performance (JMeter):** Çoklu eş zamanlı kullanıcı simülasyonu (Thread Group).

---

## 🌍 Merkezi Çoklu Ortam (Multi-Environment) Mimarisi

Framework, tüm ortamları (QA, DEV, STAGING, PROD) **tek bir merkezi konfigürasyon dosyasında ([`config/environments.json`](config/environments.json))** yönetir. Bu sayede tüm katmanlar (Playwright TS, REST Assured Java, H2 Database ve JMeter) aynı kaynaktan beslenir:

```json
{
  "defaultEnv": "qa",
  "environments": {
    "qa": { "baseUrl": "https://www.bstackdemo.com", "parallelWorkers": 3, ... },
    "dev": { "baseUrl": "https://www.bstackdemo.com", "parallelWorkers": 2, ... },
    "staging": { "baseUrl": "https://www.bstackdemo.com", "parallelWorkers": 4, ... },
    "prod": { "baseUrl": "https://www.bstackdemo.com", "parallelWorkers": 4, ... }
  }
}
```

---

## 🧪 8 Testlik Hibrit Mimari Dağılımı ($2 \times 2 \times 2 \times 2 = 8$)

Framework, her katmanda **2 adet yüksek değerli test case** koşturacak şekilde tasarlanmıştır:

| Katman | Araç & Dil | Test Sayısı | Kapsam & Senaryolar |
| :--- | :--- | :---: | :--- |
| 🌐 **Web UI** | Playwright (TypeScript) | **2** | 1. `TC-E2E-01`: 15 Adımlı Uçtan Uca Master Alışveriş & Ödeme Akışı<br>2. `TC-WEB-02`: Kullanıcı Girişi, Oturum Doğrulama & Çıkış Akışı |
| 🔌 **API** | REST Assured (Java) | **2** | 1. `TC-API-01`: `/api/products` Servis Sağlığı ve JSON Katalog Şeması<br>2. `TC-API-02`: Cihaz Stok Durumu ve Yanıt Süresi SLA Kontrolü (< 3000ms) |
| 🗄️ **Database** | H2 Database (Java/SQL) | **2** | 1. `TC-DB-01`: Aktif Kullanıcı Profili ve Ürün Stok Veri Bütünlüğü<br>2. `TC-DB-02`: `ORDERS` Tablosu İlişkisel Sipariş Kaydı Doğrulaması |
| ⚡ **Performance** | Apache JMeter (SLA) | **2** | 1. `Tx01_Home_Page`: Ana Sayfa Yük & SLA Benchmark<br>2. `Tx02_Fetch_Products_API`: Katalog API Yük & SLA Benchmark |
| 🎯 **TOPLAM** | **4 Katman Hibrit** | **8 Test** | **%100 E2E Kapsama, Uçtan Uca Doğrulama** |

---

## 📑 Otomatik Çok Sayfalı Excel Raporlama (.xlsx)

Her test koşumunda (`run-e2e.ps1`), test sonuçları otomatik olarak **`reports/excel/report_YYYYMMDD_HHMMSS/OmniQA_Execution_Report.xlsx`** yolunda 4 ayrı sayfada arşivlenir:

1. **📊 Executive Summary:** Yönetici KPI paneli, Pass Rate %, Ortam, Süre ve katman bazlı özet.
2. **🌐 Web UI Details:** Playwright testleri, tarayıcı motorları, süreler ve hata detayları.
3. **🔌 API & DB Details:** REST Assured endpoint ve H2 DB SQL doğrulama logları.
4. **⚡ Performance & SLA:** JMeter ortalama yanıt süreleri, 95th percentile ve SLA kriterleri.

---

## 📁 Repository Structure

```text
OmniQA-Framework/
│
├── config/
│   └── environments.json                  # 🌍 Tek Merkezi Ortam & Paralel Worker Konfigürasyonu
│
├── package.json                           # Kök script yöneticisi (npm test, npm run test:...)
├── pom.xml                                # Java (REST Assured & H2 DB) derleyici
├── tsconfig.json                          # Modern TypeScript konfigürasyonu
├── playwright.config.ts                   # Paralel & Cross-Browser Playwright konfigürasyonu
├── run-e2e.ps1                            # Master Unified E2E Pipeline Runner (-Parallel -Workers 3)
├── README.md                              # Framework dokümantasyonu
│
├── web/                                   # 🌐 Web UI Katmanı (Playwright + TypeScript)
│   ├── src/
│   │   ├── config/env.config.ts           # Dinamik ortam & worker yönetimi
│   │   ├── constants/                     # Rotalar, UI mesajları ve sıralama sabitleri
│   │   ├── data/                          # users.json & checkoutData.json
│   │   ├── pages/                         # Page Object Model sınıfları
│   │   └── utils/                         # Logger, Assertions, RetryHelper ve DB Helper
│       └── e2e/
│           ├── unifiedShoppingE2E.spec.ts # 🚀 TC-E2E-01: 15 Adımlı Uçtan Uca Master Hibrit Test
│           └── authFlow.spec.ts           # 🔐 TC-WEB-02: Kimlik Doğrulama, Oturum & Çıkış Testi
│
├── api/                                   # 🔌 API Katmanı (REST Assured + Java)
│   ├── src/main/java/com/omniqa/api/      # ApiConfig (JSON Parser), Endpoints, Specs, Models, Clients, Retry
│   └── src/test/java/com/omniqa/api/      # ProductsApiTest & BaseApiTest
│
├── db/                                    # 🗄️ Database & SQL Katmanı (H2 In-Memory)
│   └── src/
│       ├── main/java/com/omniqa/db/       # DatabaseManager, Entities, Services (DAOs)
│       ├── main/resources/                # schema.sql, data-seed.sql
│       └── test/java/com/omniqa/db/       # DatabaseIntegrityTest
│
├── performance/                           # ⚡ Performans & Yük Testi (Apache JMeter)
│   ├── test-plans/
│   │   └── bstackdemo_load_test.jmx       # Parametrik JMX Test Planı & SLA Doğrulamaları
│   ├── data/
│   │   ├── users.csv
│   │   └── search_terms.csv
│   └── scripts/
│       └── run-performance.ps1            # Dinamik ortam parametreli JMeter Koşturucu
│
└── reports/                               # 📊 Düzenlenmiş Raporlama Dizini (Oturum Bazlı: report_YYYYMMDD_HHMMSS)
    ├── excel/                             # 📑 Çok Sayfalı Profesyonel Excel Raporları (.xlsx)
    ├── html/                              # 🌐 Web UI Playwright HTML Raporları
    ├── api/                               # 🔌 REST Assured TestNG / Surefire Raporları
    ├── db/                                # 🗄️ H2 Database Bütünlük Test Raporları
    ├── perf/                              # ⚡ JMeter İnteraktif HTML Dashboard & JTL Logları
    ├── screenshots/                       # 📸 Hata (Failure) Tam Sayfa Ekran Görüntüleri
    └── logs/                              # 📝 Detaylı Kronolojik Oturum Logları (execution.log)
```

---

## 🚀 Projeyi Çalıştırma Komutları

### 🌟 1. Ortam Bazlı Tüm Boru Hattını Birlikte Koşturma (15 Adımlı Master Flow)

| Ortam | Sıralı (Sequential) Mod | Sıralı Headed (Canlı İzleme) | Paralel Mod (Workers) | Paralel Headed (Canlı İzleme) |
| :--- | :--- | :--- | :--- | :--- |
| **QA (Varsayılan)** | `npm test` veya `npm run test:qa` | `npm run test:qa:headed` veya `npm run test:headed` | `npm run test:parallel` veya `npm run test:qa:parallel` | `npm run test:parallel:headed` veya `npm run test:qa:parallel:headed` |
| **DEV** | `npm run test:dev` | `npm run test:dev:headed` | `npm run test:dev:parallel` | `npm run test:dev:parallel:headed` |
| **STAGING** | `npm run test:staging` | `npm run test:staging:headed` | `npm run test:staging:parallel` | `npm run test:staging:parallel:headed` |
| **PROD** | `npm run test:prod` | `npm run test:prod:headed` | `npm run test:prod:parallel` | `npm run test:prod:parallel:headed` |

---

### 🌐 2. Çoklu Tarayıcı (Cross-Browser & Multi-Browser) Koşumları

| Tarayıcı / Platform | Standart Koşum | Canlı İzleme (Headed) | Web UI Hızlı Koşum | Web UI Headed |
| :--- | :--- | :--- | :--- | :--- |
| **🌐 Cross-Browser (Chrome + Firefox + Safari)** | `npm run test:cross-browser` | `npm run test:cross-browser:headed` | `npm run test:web:cross-browser` | `npm run test:web:cross-browser:headed` |
| **🟢 Google Chrome (Chromium)** | `npm run test:chrome` | `npm run test:chrome:headed` | `npm run test:web:chrome` | `npm run test:web:chrome:headed` |
| **🟠 Mozilla Firefox** | `npm run test:firefox` | `npm run test:firefox:headed` | `npm run test:web:firefox` | `npm run test:web:firefox:headed` |
| **🔵 Apple Safari (WebKit)** | `npm run test:webkit` | `npm run test:webkit:headed` | `npm run test:web:webkit` | `npm run test:web:webkit:headed` |
| **📱 Mobil Emülasyon (Android & iOS)** | `npm run test:mobile` | - | `npm run test:web:mobile:chrome` | `npm run test:web:mobile:safari` |

---

### 🎯 3. Katmanları Ayrı Ayrı Çalıştırma & Raporlama (Kısayollar)

| Katman / Görev | Standart Komut | Headed (Canlı İzleme) | Paralel Komut |
| :--- | :--- | :--- | :--- |
| **🌐 Web UI (Tüm Testler)** | `npm run test:web` | `npm run test:web:headed` | `npm run test:web:parallel` |
| **🌐 Web UI (Cross-Browser)** | `npm run test:web:cross-browser` | `npm run test:web:cross-browser:headed` | `npm run test:web:parallel` |
| **🌐 Web UI (QA)** | `npm run test:web:qa` | `npm run test:web:qa:headed` | `npm run test:web:qa:parallel` |
| **🌐 Web UI Dashboard** | `npm run test:web:ui` | - | - |
| **🔌 API Testi** | `npm run test:api` | - | `npm run test:api:parallel` *(3 Thread)* |
| **🗄️ Database Testi** | `npm run test:db` | - | - |
| **⚡ Performans Testi** | `npm run test:performance` | - | - |
| **📑 Excel Raporunu Aç (.xlsx)** | `npm run report:excel` | - | - |
| **📑 Excel Raporunu Yeniden Üret** | `npm run report:excel:generate` | - | - |
| **📊 HTML Raporu Aç** | `npm run report` | - | - |

---

## 🤖 CI/CD: GitHub Actions Entegrasyonu

Framework, [`.github/workflows/omniqa-ci.yml`](.github/workflows/omniqa-ci.yml) dosyası ile tam otomatik **GitHub Actions CI/CD Pipeline** desteğine sahiptir:

- **Tetikleyiciler (Triggers):**
  - Her `push` ve `pull_request` (main/master).
  - Hafta içi her gece otomatik zamanlanmış koşum (`cron: 0 2 * * 1-5`).
  - **Manuel Tetikleme (`workflow_dispatch`):** GitHub arayüzünden tek tıkla **Ortam (QA, DEV, STAGING, PROD)**, **Tarayıcı (Chromium, Firefox, Safari, All)** ve **Paralel Worker Sayısı (1, 2, 3, 4)** seçilerek çalıştırılabilir.
- **Otomatik Arşivleme & Artifacts:**
  - 📑 Excel Raporu (`OmniQA_Execution_Report.xlsx`)
  - 🌐 Playwright HTML Test Raporu
  - 🔌 REST Assured API & DB TestNG Raporları
  - ⚡ JMeter HTML Dashboard & SLA Metrikleri
  - 📸 Hata Ekran Görüntüleri & 📝 Detaylı Oturum Logları
- **GitHub Step Summary:** Test sonuçları GitHub Actions özet ekranında doğrudan renkli tablo olarak listelenir.
