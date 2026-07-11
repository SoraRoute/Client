CREATE TABLE sellers(
    id INT AUTO_INCREMENT PRIMARY KEY,

    seller_name VARCHAR(100) NOT NULL,

    email VARCHAR(100) UNIQUE NOT NULL,

    mobile VARCHAR(15) UNIQUE NOT NULL,

    passwordd VARCHAR(255) NOT NULL,

    gstin VARCHAR(20) UNIQUE NOT NULL,

    role ENUM('seller','admin') DEFAULT 'seller',

    account_status ENUM('PENDING','ACTIVE','SUSPENDED') DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);