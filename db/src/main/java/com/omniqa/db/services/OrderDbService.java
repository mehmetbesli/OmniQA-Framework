package com.omniqa.db.services;

import com.omniqa.db.connection.DatabaseManager;
import com.omniqa.db.models.OrderEntity;
import com.omniqa.db.queries.QueryConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class OrderDbService {
    private static final Logger logger = LoggerFactory.getLogger(OrderDbService.class);

    public List<OrderEntity> getOrdersByUser(String username) {
        List<OrderEntity> orders = new ArrayList<>();
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(QueryConstants.SELECT_ORDERS_BY_USER)) {

            stmt.setString(1, username);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    orders.add(mapResultSetToOrder(rs));
                }
            }
        } catch (SQLException e) {
            logger.error("Error fetching orders for user: {}", username, e);
        }
        return orders;
    }

    public boolean insertOrder(OrderEntity order) {
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(QueryConstants.INSERT_ORDER)) {

            stmt.setString(1, order.getOrderId());
            stmt.setString(2, order.getUsername());
            stmt.setString(3, order.getFirstName());
            stmt.setString(4, order.getLastName());
            stmt.setString(5, order.getAddress());
            stmt.setString(6, order.getState());
            stmt.setString(7, order.getPostalCode());
            stmt.setDouble(8, order.getTotalAmount());
            stmt.setString(9, order.getStatus());

            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            logger.error("Error inserting order: {}", order.getOrderId(), e);
            return false;
        }
    }

    private OrderEntity mapResultSetToOrder(ResultSet rs) throws SQLException {
        return new OrderEntity(
                rs.getString("order_id"),
                rs.getString("username"),
                rs.getString("first_name"),
                rs.getString("last_name"),
                rs.getString("address"),
                rs.getString("state"),
                rs.getString("postal_code"),
                rs.getDouble("total_amount"),
                rs.getString("status"),
                rs.getTimestamp("created_at")
        );
    }
}
