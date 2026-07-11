CREATE TABLE bank_details(
    id INT AUTO_INCREMENT PRIMARY KEY,

    seller_id INT NOT NULL,

    account_holder_name VARCHAR(100) NOT NULL,

    account_number VARCHAR(30) NOT NULL,

    bank_name VARCHAR(100) NOT NULL,

    ifsc_code VARCHAR(20) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(seller_id)
    REFERENCES sellers(id)
    ON DELETE CASCADE
);