CREATE TABLE business_details(
    id INT AUTO_INCREMENT PRIMARY KEY,

    seller_id INT NOT NULL,

    business_name VARCHAR(150) NOT NULL,

    business_email VARCHAR(100),

    business_mobile VARCHAR(15),

    business_type VARCHAR(100),

    business_address TEXT,

    pan_number VARCHAR(20),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(seller_id)
    REFERENCES sellers(id)
    ON DELETE CASCADE
);