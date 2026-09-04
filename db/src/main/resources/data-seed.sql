-- OmniQA H2 Seed Data

-- Users
INSERT INTO USERS (username, password, display_name, status) VALUES
('demouser', 'testingisfun99', 'demouser', 'ACTIVE'),
('existing_orders_user', 'testingisfun99', 'existing_orders_user', 'ACTIVE'),
('fav_user', 'testingisfun99', 'fav_user', 'ACTIVE'),
('image_not_loading_user', 'testingisfun99', 'image_not_loading_user', 'ACTIVE'),
('locked_user', 'testingisfun99', 'locked_user', 'LOCKED');

-- Products
INSERT INTO PRODUCTS (id, title, description, vendor, price, currency, installments, is_fav, sku, stock_quantity) VALUES
(1, 'iPhone 12', 'iPhone 12', 'Apple', 799.00, 'USD', 4, false, 'iphone-12-device-info.png', 50),
(2, 'iPhone 12 Mini', 'iPhone 12 Mini', 'Apple', 699.00, 'USD', 4, false, 'iphone-12-mini-device-info.png', 50),
(3, 'iPhone 12 Pro Max', 'iPhone 12 Pro Max', 'Apple', 1099.00, 'USD', 4, false, 'iphone-12-pro-max-device-info.png', 40),
(4, 'iPhone 12 Pro', 'iPhone 12 Pro', 'Apple', 999.00, 'USD', 4, false, 'iphone-12-pro-device-info.png', 40),
(5, 'iPhone 11', 'iPhone 11', 'Apple', 599.00, 'USD', 4, false, 'iphone-11-device-info.png', 30),
(6, 'iPhone 11 Pro', 'iPhone 11 Pro', 'Apple', 899.00, 'USD', 4, false, 'iphone-11-pro-device-info.png', 30),
(7, 'Galaxy S20', 'Galaxy S20', 'Samsung', 799.00, 'USD', 4, false, 'samsung-s20-device-info.png', 50),
(8, 'Galaxy S20+', 'Galaxy S20+', 'Samsung', 899.00, 'USD', 4, false, 'samsung-s20-plus-device-info.png', 50),
(9, 'Galaxy S20 Ultra', 'Galaxy S20 Ultra', 'Samsung', 1099.00, 'USD', 4, false, 'samsung-s20-ultra-device-info.png', 30),
(10, 'Pixel 4', 'Pixel 4', 'Google', 899.00, 'USD', 5, false, 'GooglePixel4-device-info.png', 40),
(11, 'Pixel 3', 'Pixel 3', 'Google', 599.00, 'USD', 5, false, 'GooglePixel3-device-info.png', 35),
(12, 'One Plus 8', 'One Plus 8', 'OnePlus', 799.00, 'USD', 6, false, 'OnePlus8-device-info.png', 45),
(13, 'One Plus 8T', 'One Plus 8T', 'OnePlus', 899.00, 'USD', 6, false, 'OnePlus8-device-info.png', 40);

-- Orders
INSERT INTO ORDERS (order_id, username, first_name, last_name, address, state, postal_code, total_amount, status) VALUES
('ORD-1001', 'existing_orders_user', 'Existing', 'User', '123 Order Street', 'California', '90210', 799.00, 'CONFIRMED'),
('ORD-1002', 'existing_orders_user', 'Existing', 'User', '123 Order Street', 'California', '90210', 1498.00, 'CONFIRMED');

-- Order Items
INSERT INTO ORDER_ITEMS (order_id, product_id, product_title, quantity, unit_price) VALUES
('ORD-1001', 1, 'iPhone 12', 1, 799.00),
('ORD-1002', 7, 'Galaxy S20', 1, 799.00),
('ORD-1002', 2, 'iPhone 12 Mini', 1, 699.00);
