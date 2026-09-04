package com.omniqa.api.clients;

import com.omniqa.api.specs.SpecFactory;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

import static io.restassured.RestAssured.given;

public abstract class BaseApiClient {
    protected final Logger logger = LoggerFactory.getLogger(getClass());

    protected RequestSpecification getRequestSpec() {
        return SpecFactory.getDefaultRequestSpec();
    }

    protected Response get(String endpoint) {
        logger.info("Sending GET request to: {}", endpoint);
        return given()
                .spec(getRequestSpec())
                .when()
                .get(endpoint)
                .then()
                .extract()
                .response();
    }

    protected Response get(String endpoint, Map<String, ?> queryParams) {
        logger.info("Sending GET request to: {} with params: {}", endpoint, queryParams);
        return given()
                .spec(getRequestSpec())
                .queryParams(queryParams)
                .when()
                .get(endpoint)
                .then()
                .extract()
                .response();
    }

    protected Response post(String endpoint, Object payload) {
        logger.info("Sending POST request to: {}", endpoint);
        return given()
                .spec(getRequestSpec())
                .body(payload)
                .when()
                .post(endpoint)
                .then()
                .extract()
                .response();
    }
}
