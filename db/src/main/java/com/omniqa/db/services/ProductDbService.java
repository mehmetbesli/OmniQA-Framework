package com.omniqa.db.services;

import com.omniqa.db.connection.DatabaseManager;
import com.omniqa.db.models.ProductEntity;
import com.omniqa.db.queries.QueryConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ProductDbService {
    private static final Logger logger = LoggerFactory.getLogger(ProductDbService.class);

    public List<ProductEntity> getAllProducts() {
        List<ProductEntity> products = new ArrayList<>();
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(QueryConstants.SELECT_ALL_PRODUCTS);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                products.add(mapResultSetToProduct(rs));
            }
        } catch (SQLException e) {
            logger.error("Error fetching all products from DB", e);
        }
        return products;
    }

    public List<ProductEntity> getProductsByVendor(String vendor) {
        List<ProductEntity> products = new ArrayList<>();
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(QueryConstants.SELECT_PRODUCTS_BY_VENDOR)) {

            stmt.setString(1, vendor);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    products.add(mapResultSetToProduct(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error fetching products by vendor: {}", vendor, e);
        }
        return products;
    }

    public ProductEntity getProductById(int id) {
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(QueryConstants.SELECT_PRODUCT_BY_ID)) {

            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToProduct(rs);
                }
            }
        } catch (SQLException e) {
            logger.error("Error fetching product by id: {}", id, e);
        }
        return null;
    }

    public int getProductCount() {
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(QueryConstants.COUNT_PRODUCTS);
             ResultSet rs = stmt.executeQuery()) {

            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            logger.error("Error counting products in DB", e);
        }
        return 0;
    }

    private ProductEntity mapResultSetToProduct(ResultSet rs) throws SQLException {
        return new ProductEntity(
                rs.getInt("id"),
                rs.getString("title"),
                rs.getString("description"),
                rs.getString("vendor"),
                rs.getDouble("price"),
                rs.getString("currency"),
                rs.getInt("installments"),
                rs.getBoolean("is_fav"),
                rs.getString("sku"),
                rs.getInt("stock_quantity")
        );
    }
}
