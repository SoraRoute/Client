CREATE TABLE categories(
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) UNIQUE NOT NULL,

    description TEXT,

    parent_category_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(parent_category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);