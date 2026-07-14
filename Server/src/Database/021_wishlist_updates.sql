ALTER TABLE wishlist_items
ADD CONSTRAINT unique_wishlist_product
UNIQUE (wishlist_id, product_id);