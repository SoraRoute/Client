CREATE TABLE products(
    id INT AUTO_INCREMENT PRIMARY KEY,

    seller_id INT NOT NULL,

    category_id INT NOT NULL,

    title VARCHAR(255) NOT NULL,

    description TEXT,

    brand VARCHAR(100),

    price DECIMAL(10,2) NOT NULL,

    discount_price DECIMAL(10,2),

    status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(seller_id)
    REFERENCES sellers(id)
    ON DELETE CASCADE,

    FOREIGN KEY(category_id)
    REFERENCES categories(id)
);