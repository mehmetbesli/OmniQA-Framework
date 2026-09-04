package com.omniqa.db.services;

import com.omniqa.db.connection.DatabaseManager;
import com.omniqa.db.models.UserEntity;
import com.omniqa.db.queries.QueryConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UserDbService {
    private static final Logger logger = LoggerFactory.getLogger(UserDbService.class);

    public List<UserEntity> getAllUsers() {
        List<UserEntity> users = new ArrayList<>();
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(QueryConstants.SELECT_ALL_USERS);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                users.add(mapResultSetToUser(rs));
            }
        } catch (SQLException e) {
            logger.error("Error fetching all users from DB", e);
        }
        return users;
    }

    public UserEntity getUserByUsername(String username) {
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(QueryConstants.SELECT_USER_BY_USERNAME)) {

            stmt.setString(1, username);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToUser(rs);
                }
            }
        } catch (SQLException e) {
            logger.error("Error fetching user by username: {}", username, e);
        }
        return null;
    }

    public int getUserCount() {
        try (Connection conn = DatabaseManager.getConnection();
             PreparedStatement stmt = conn.prepareStatement(QueryConstants.COUNT_USERS);
             ResultSet rs = stmt.executeQuery()) {

            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            logger.error("Error counting users in DB", e);
        }
        return 0;
    }

    private UserEntity mapResultSetToUser(ResultSet rs) throws SQLException {
        return new UserEntity(
                rs.getInt("id"),
                rs.getString("username"),
                rs.getString("password"),
                rs.getString("display_name"),
                rs.getString("status")
        );
    }
}
