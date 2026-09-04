package com.omniqa.api;

import com.omniqa.api.config.ApiConfig;
import io.restassured.RestAssured;
import org.testng.annotations.BeforeSuite;

public abstract class BaseApiTest {
    @BeforeSuite(alwaysRun = true)
    public void setupSuite() {
        RestAssured.baseURI = ApiConfig.getBaseUri();
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }
}
