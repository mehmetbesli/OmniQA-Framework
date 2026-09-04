package com.omniqa.db.queries;

public final class QueryConstants {
    private QueryConstants() {}

    // Users
    public static final String SELECT_ALL_USERS = "SELECT * FROM USERS";
    public static final String SELECT_USER_BY_USERNAME = "SELECT * FROM USERS WHERE username = ?";
    public static final String COUNT_USERS = "SELECT COUNT(*) FROM USERS";

    // Products
    public static final String SELECT_ALL_PRODUCTS = "SELECT * FROM PRODUCTS";
    public static final String SELECT_PRODUCTS_BY_VENDOR = "SELECT * FROM PRODUCTS WHERE vendor = ?";
    public static final String SELECT_PRODUCT_BY_ID = "SELECT * FROM PRODUCTS WHERE id = ?";
    public static final String COUNT_PRODUCTS = "SELECT COUNT(*) FROM PRODUCTS";
    public static final String INSERT_PRODUCT = "INSERT INTO PRODUCTS (id, title, description, vendor, price, currency, installments, is_fav, sku, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // Orders
    public static final String SELECT_ORDERS_BY_USER = "SELECT * FROM ORDERS WHERE username = ? ORDER BY created_at DESC";
    public static final String SELECT_ORDER_ITEMS_BY_ORDER_ID = "SELECT * FROM ORDER_ITEMS WHERE order_id = ?";
    public static final String INSERT_ORDER = "INSERT INTO ORDERS (order_id, username, first_name, last_name, address, state, postal_code, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    public static final String INSERT_ORDER_ITEM = "INSERT INTO ORDER_ITEMS (order_id, product_id, product_title, quantity, unit_price) VALUES (?, ?, ?, ?, ?)";
}
