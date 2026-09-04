package com.omniqa.api.clients;

import com.omniqa.api.config.Endpoints;
import com.omniqa.api.models.Product;
import com.omniqa.api.models.ProductResponse;
import io.restassured.response.Response;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class ProductsApiClient extends BaseApiClient {

    public Response getProductsRawResponse() {
        return get(Endpoints.PRODUCTS);
    }

    public ProductResponse getProducts() {
        return get(Endpoints.PRODUCTS)
                .then()
                .statusCode(200)
                .extract()
                .as(ProductResponse.class);
    }

    public List<Product> getAllProductsList() {
        ProductResponse response = getProducts();
        return response.getProducts() != null ? response.getProducts() : Collections.emptyList();
    }

    public List<Product> getProductsByVendor(String vendorName) {
        return getAllProductsList().stream()
                .filter(p -> p.getAvailableSizes() != null &&
                        p.getAvailableSizes().stream().anyMatch(size -> size.equalsIgnoreCase(vendorName)))
                .collect(Collectors.toList());
    }

    public Product getProductById(int id) {
        return getAllProductsList().stream()
                .filter(p -> p.getId() == id)
                .findFirst()
                .orElse(null);
    }
}
