CREATE TABLE wishlist_items(
    id INT AUTO_INCREMENT PRIMARY KEY,

    wishlist_id INT NOT NULL,

    product_id INT NOT NULL,

    FOREIGN KEY(wishlist_id)
    REFERENCES wishlists(id)
    ON DELETE CASCADE,

    FOREIGN KEY(product_id)
    REFERENCES products(id)
);