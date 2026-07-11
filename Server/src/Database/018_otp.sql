CREATE TABLE verification_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,

    email VARCHAR(255) NOT NULL,

    otp_hash VARCHAR(255) NOT NULL,

    purpose ENUM(
        'REGISTER',
        'RESET_PASSWORD'
    )NOT NULL,

    expires_at DATETIME NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);