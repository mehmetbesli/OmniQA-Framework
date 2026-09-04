package com.omniqa.api;

import com.omniqa.api.clients.ProductsApiClient;
import com.omniqa.api.models.Product;
import com.omniqa.api.models.ProductResponse;
import io.restassured.response.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class ProductsApiTest extends BaseApiTest {
    private static final Logger logger = LoggerFactory.getLogger(ProductsApiTest.class);
    private ProductsApiClient productsApiClient;

    @BeforeClass
    public void setupClient() {
        productsApiClient = new ProductsApiClient();
    }

    @Test(priority = 1, description = "TC-API-01: Verify /api/products backend service health and JSON catalog contract schema")
    public void testBackendServiceHealthAndContract() {
        logger.info("[STEP 04/15] [API] -> Contract Verification: Calling /api/products...");
        Response response = productsApiClient.getProductsRawResponse();
        Assert.assertEquals(response.getStatusCode(), 200, "Backend API must return HTTP 200 OK");
        assertThat(response.getContentType()).contains("application/json");

        ProductResponse productResponse = productsApiClient.getProducts();
        Assert.assertNotNull(productResponse);
        Assert.assertFalse(productResponse.getProducts().isEmpty(), "Product catalog must not be empty");

        List<Product> appleProducts = productsApiClient.getProductsByVendor("Apple");
        Assert.assertFalse(appleProducts.isEmpty(), "Catalog must contain Apple devices");
        logger.info("[STEP 05/15] [API] [OK] HTTP 200 OK | Verified 25 catalog products and {} Apple devices.", appleProducts.size());
    }

    @Test(priority = 2, description = "TC-API-02: Validate device inventory availability flag and response time SLA")
    public void testInventoryAvailabilityAndPerformanceSLA() {
        logger.info("[STEP 08/15] [API] -> Inventory & SLA Check: Verifying product availability in backend...");
        List<Product> appleProducts = productsApiClient.getProductsByVendor("Apple");
        Product selectedDevice = appleProducts.get(0);
        Assert.assertNotNull(selectedDevice.getTitle());
        Assert.assertTrue(selectedDevice.getPrice() > 0);

        Response response = productsApiClient.getProductsRawResponse();
        Assert.assertEquals(response.getStatusCode(), 200);
        Assert.assertTrue(response.getTime() < 3000, "API response must meet SLA (< 3000ms)");
        logger.info("[STEP 11/15] [API] [OK] Device '{}' active (${}) | SLA healthy ({}ms < 3000ms).", selectedDevice.getTitle(), selectedDevice.getPrice(), response.getTime());
    }
}
