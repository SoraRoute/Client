CREATE TABLE inventory(
    id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT UNIQUE NOT NULL,

    quantity INT DEFAULT 0,

    FOREIGN KEY(product_id)
    REFERENCES products(id)
    ON DELETE CASCADE
);