CREATE TABLE orders(
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    total_amount DECIMAL(10,2),

    order_status ENUM(
        'PLACED',
        'CONFIRMED',
        'SHIPPED',
        'DELIVERED',
        'CANCELLED'
    ) DEFAULT 'PLACED',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
    REFERENCES users(id)
);