package com.omniqa.db.connection;

import com.omniqa.api.config.ApiConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseManager {
    private static final Logger logger = LoggerFactory.getLogger(DatabaseManager.class);
    private static Connection connection;

    private DatabaseManager() {}

    public static String getJdbcUrl() {
        return ApiConfig.getDbUrl();
    }

    public static String getDbUser() {
        return ApiConfig.getDbUser();
    }

    public static String getDbPassword() {
        return ApiConfig.getDbPassword();
    }

    public static synchronized Connection getConnection() throws SQLException {
        if (connection == null || connection.isClosed()) {
            String url = getJdbcUrl();
            String user = getDbUser();
            String pass = getDbPassword();
            logger.debug("Establishing Database connection: {} (User: {})", url, user);
            connection = DriverManager.getConnection(url, user, pass);
        }
        return connection;
    }

    public static void initializeDatabase() {
        logger.debug("Initializing H2 Database schema and seed data...");
        executeSqlScript("schema.sql");
        executeSqlScript("data-seed.sql");
        logger.debug("H2 Database initialized successfully.");
    }

    public static void executeSqlScript(String scriptPath) {
        try (InputStream is = DatabaseManager.class.getClassLoader().getResourceAsStream(scriptPath)) {
            if (is == null) {
                throw new RuntimeException("SQL script not found in classpath: " + scriptPath);
            }

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
                 Connection conn = getConnection();
                 Statement stmt = conn.createStatement()) {

                StringBuilder sqlBuilder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    String trimmed = line.trim();
                    if (trimmed.isEmpty() || trimmed.startsWith("--")) {
                        continue;
                    }
                    sqlBuilder.append(line).append(" ");
                    if (trimmed.endsWith(";")) {
                        stmt.execute(sqlBuilder.toString());
                        sqlBuilder.setLength(0);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error executing SQL script: {}", scriptPath, e);
            throw new RuntimeException("Failed to execute SQL script: " + scriptPath, e);
        }
    }

    public static synchronized void closeConnection() {
        if (connection != null) {
            try {
                if (!connection.isClosed()) {
                    connection.close();
                    logger.debug("Database connection closed.");
                }
            } catch (SQLException e) {
                logger.error("Error closing DB connection", e);
            }
        }
    }
}
