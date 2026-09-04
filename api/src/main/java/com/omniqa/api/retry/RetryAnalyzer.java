package com.omniqa.api.retry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

/**
 * Automatically retries failed TestNG tests to handle transient network/database glitches.
 */
public class RetryAnalyzer implements IRetryAnalyzer {
    private static final Logger logger = LoggerFactory.getLogger(RetryAnalyzer.class);
    private int retryCount = 0;
    private static final int MAX_RETRY_COUNT = Integer.parseInt(System.getProperty("retry.count", "2"));

    @Override
    public boolean retry(ITestResult result) {
        if (retryCount < MAX_RETRY_COUNT) {
            retryCount++;
            logger.warn("[RETRY] Test '{}' failed. Retrying (Attempt {}/{})... Reason: {}",
                    result.getName(),
                    retryCount,
                    MAX_RETRY_COUNT,
                    result.getThrowable() != null ? result.getThrowable().getMessage() : "Unknown");
            return true;
        }
        return false;
    }
}
