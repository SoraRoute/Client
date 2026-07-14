ALTER TABLE product_images
ADD COLUMN public_id VARCHAR(255) NOT NULL AFTER image_url;