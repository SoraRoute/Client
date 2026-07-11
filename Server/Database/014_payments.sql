CREATE TABLE payments(
    id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT UNIQUE NOT NULL,

    payment_method ENUM(
        'COD',
        'UPI',
        'CARD',
        'NETBANKING'
    ),

    payment_status ENUM(
        'PENDING',
        'SUCCESS',
        'FAILED'
    ) DEFAULT 'PENDING',

    transaction_id VARCHAR(100),

    FOREIGN KEY(order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE
);