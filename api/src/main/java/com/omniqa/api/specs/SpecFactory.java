package com.omniqa.api.specs;

import com.omniqa.api.config.ApiConfig;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.builder.ResponseSpecBuilder;
import io.restassured.filter.log.LogDetail;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;
import io.restassured.specification.ResponseSpecification;

public class SpecFactory {

    public static RequestSpecification getDefaultRequestSpec() {
        return new RequestSpecBuilder()
                .setBaseUri(ApiConfig.getBaseUri())
                .setContentType(ContentType.JSON)
                .setAccept(ContentType.JSON)
                .log(LogDetail.URI)
                .log(LogDetail.METHOD)
                .build();
    }

    public static ResponseSpecification getSuccessResponseSpec() {
        return new ResponseSpecBuilder()
                .expectStatusCode(200)
                .expectContentType(ContentType.JSON)
                .log(LogDetail.STATUS)
                .build();
    }
}
