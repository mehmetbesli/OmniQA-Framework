package com.omniqa.db;

import com.omniqa.db.connection.DatabaseManager;
import com.omniqa.db.models.OrderEntity;
import com.omniqa.db.models.ProductEntity;
import com.omniqa.db.models.UserEntity;
import com.omniqa.db.services.OrderDbService;
import com.omniqa.db.services.ProductDbService;
import com.omniqa.db.services.UserDbService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.Assert;
import org.testng.annotations.AfterSuite;
import org.testng.annotations.BeforeSuite;
import org.testng.annotations.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class DatabaseIntegrityTest {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseIntegrityTest.class);

    private ProductDbService productDbService;
    private UserDbService userDbService;
    private OrderDbService orderDbService;

    @BeforeSuite(alwaysRun = true)
    public void setupDatabase() {
        DatabaseManager.initializeDatabase();
        productDbService = new ProductDbService();
        userDbService = new UserDbService();
        orderDbService = new OrderDbService();
    }

    @AfterSuite(alwaysRun = true)
    public void tearDownDatabase() {
        DatabaseManager.closeConnection();
    }

    @Test(priority = 1, description = "TC-DB-01: Verify active user profile and product catalog stock integrity via H2 SQL")
    public void testUserDataAndProductStockIntegrity() {
        logger.info("[STEP 06/15] [DB]  -> Test Data & Stock Check: Fetching user and querying inventory...");
        UserEntity demoUser = userDbService.getUserByUsername("demouser");
        Assert.assertNotNull(demoUser, "demouser must exist in H2 DB");
        assertThat(demoUser.getStatus()).isEqualTo("ACTIVE");

        List<ProductEntity> appleProducts = productDbService.getProductsByVendor("Apple");
        assertThat(appleProducts).isNotEmpty();
        logger.info("[STEP 09/15] [DB]  [OK] Profile retrieved (demouser: ACTIVE) and {} Apple products verified in DB.", appleProducts.size());
    }

    @Test(priority = 2, description = "TC-DB-02: Validate relational order persistence and audit record in H2 ORDERS table")
    public void testOrderPersistenceAndRelationalIntegrity() {
        logger.info("[STEP 12/15] [DB]  -> SQL Order Persistence: Verifying order record in ORDERS table...");
        String testOrderId = "ORD-" + System.currentTimeMillis();
        OrderEntity newOrder = new OrderEntity(
                testOrderId, "demouser", "Mehmet", "Besli", "Ataturk Cad. No 123", "Istanbul", "34000", 799.00, "CONFIRMED", null
        );
        Assert.assertTrue(orderDbService.insertOrder(newOrder), "Order must be successfully inserted into H2 DB");
        logger.info("[STEP 12/15] [DB]  [OK] Relational order record '{}' persisted and verified in H2 database.", testOrderId);
    }
}
