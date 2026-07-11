CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,

    first_name VARCHAR(100),

    last_name VARCHAR(100),

    email VARCHAR(100) UNIQUE NOT NULL,

    mobile VARCHAR(15) UNIQUE,

    password VARCHAR(255) NOT NULL,

    role ENUM('customer','admin') DEFAULT 'customer',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);