package com.omniqa.api.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.InputStream;

public class ApiConfig {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static JsonNode rootNode;
    private static final String activeEnv;

    static {
        String env = System.getProperty("env");
        if (env == null || env.trim().isEmpty()) {
            env = System.getenv("TEST_ENV");
        }
        if (env == null || env.trim().isEmpty()) {
            env = System.getenv("ENV");
        }
        if (env == null || env.trim().isEmpty()) {
            env = "qa";
        }
        activeEnv = env.trim().toLowerCase();

        try {
            // First check classpath (environments.json)
            try (InputStream is = ApiConfig.class.getClassLoader().getResourceAsStream("environments.json")) {
                if (is != null) {
                    rootNode = objectMapper.readTree(is);
                }
            }

            // Fallback to relative project path
            if (rootNode == null) {
                File file = new File("config/environments.json");
                if (file.exists()) {
                    rootNode = objectMapper.readTree(file);
                }
            }
        } catch (Exception e) {
            System.err.println("Warning: Could not load environments.json: " + e.getMessage());
        }
    }

    public static String getEnvironment() {
        return activeEnv;
    }

    private static JsonNode getEnvNode() {
        if (rootNode != null && rootNode.has("environments")) {
            JsonNode envs = rootNode.get("environments");
            if (envs.has(activeEnv)) {
                return envs.get(activeEnv);
            }
            if (rootNode.has("defaultEnv") && envs.has(rootNode.get("defaultEnv").asText())) {
                return envs.get(rootNode.get("defaultEnv").asText());
            }
        }
        return null;
    }

    public static String getBaseUri() {
        String sysProp = System.getProperty("base.uri");
        if (sysProp != null && !sysProp.trim().isEmpty()) {
            return sysProp.trim();
        }
        String envApi = System.getenv("API_BASE_URL");
        if (envApi != null && !envApi.trim().isEmpty()) {
            return envApi.trim();
        }
        String envBase = System.getenv("BASE_URL");
        if (envBase != null && !envBase.trim().isEmpty()) {
            return envBase.trim();
        }

        JsonNode envNode = getEnvNode();
        if (envNode != null) {
            if (envNode.has("apiBaseUrl")) return envNode.get("apiBaseUrl").asText();
            if (envNode.has("baseUrl")) return envNode.get("baseUrl").asText();
        }
        return "https://www.bstackdemo.com";
    }

    public static String getBasePath() {
        String sysProp = System.getProperty("base.path");
        if (sysProp != null && !sysProp.trim().isEmpty()) {
            return sysProp.trim();
        }
        String envPath = System.getenv("API_PATH");
        if (envPath != null && !envPath.trim().isEmpty()) {
            return envPath.trim();
        }

        JsonNode envNode = getEnvNode();
        if (envNode != null && envNode.has("apiPath")) {
            return envNode.get("apiPath").asText();
        }
        return "/api";
    }

    public static long getTimeout() {
        String sysProp = System.getProperty("timeout.default");
        if (sysProp != null && !sysProp.trim().isEmpty()) {
            return Long.parseLong(sysProp.trim());
        }
        String envTimeout = System.getenv("API_TIMEOUT");
        if (envTimeout != null && !envTimeout.trim().isEmpty()) {
            return Long.parseLong(envTimeout.trim());
        }

        JsonNode envNode = getEnvNode();
        if (envNode != null && envNode.has("timeouts") && envNode.get("timeouts").has("api")) {
            return envNode.get("timeouts").get("api").asLong();
        }
        return 15000L;
    }

    public static String getDbUrl() {
        String sysProp = System.getProperty("db.url");
        if (sysProp != null && !sysProp.trim().isEmpty()) {
            return sysProp.trim();
        }
        String envDb = System.getenv("DB_URL");
        if (envDb != null && !envDb.trim().isEmpty()) {
            return envDb.trim();
        }

        JsonNode envNode = getEnvNode();
        if (envNode != null && envNode.has("database") && envNode.get("database").has("url")) {
            return envNode.get("database").get("url").asText();
        }
        return "jdbc:h2:mem:omniqa_db;DB_CLOSE_DELAY=-1";
    }

    public static String getDbUser() {
        String sysProp = System.getProperty("db.user");
        if (sysProp != null && !sysProp.trim().isEmpty()) {
            return sysProp.trim();
        }
        String envDbUser = System.getenv("DB_USER");
        if (envDbUser != null && !envDbUser.trim().isEmpty()) {
            return envDbUser.trim();
        }

        JsonNode envNode = getEnvNode();
        if (envNode != null && envNode.has("database") && envNode.get("database").has("user")) {
            return envNode.get("database").get("user").asText();
        }
        return "sa";
    }

    public static String getDbPassword() {
        String sysProp = System.getProperty("db.password");
        if (sysProp != null) {
            return sysProp;
        }
        String envDbPass = System.getenv("DB_PASSWORD");
        if (envDbPass != null) {
            return envDbPass;
        }

        JsonNode envNode = getEnvNode();
        if (envNode != null && envNode.has("database") && envNode.get("database").has("password")) {
            return envNode.get("database").get("password").asText();
        }
        return "";
    }
}
