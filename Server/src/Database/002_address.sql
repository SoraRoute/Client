CREATE TABLE addresses(
    id INT AUTO_INCREMENT PRIMARY KEY,

    seller_id INT NOT NULL,

    address_line1 VARCHAR(255) NOT NULL,

    address_line2 VARCHAR(255),

    city VARCHAR(100) NOT NULL,

    state VARCHAR(100) NOT NULL,

    pincode VARCHAR(10) NOT NULL,

    country VARCHAR(100) DEFAULT 'India',

    address_type ENUM('pickup','business','home')
    DEFAULT 'pickup',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(seller_id)
    REFERENCES sellers(id)
    ON DELETE CASCADE
);