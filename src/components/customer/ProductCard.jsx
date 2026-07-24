import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { formatPrice, effectivePrice } from "../../utils/format";

// The customer product endpoints never return product_images (the backend
// query is a plain `SELECT * FROM products`), so there's no image URL to
// render. A consistent lettered placeholder stands in for the photo across
// every grid instead of a broken <img>.
function ProductImage({ product }) {
    if (product.image_url) {

        return (
            <img
                src={product.image_url}
                alt={product.title}
                className="aspect-square w-full rounded-xl object-cover"
            />
        );
    }

    const letter = (product.title || "?").trim().charAt(0).toUpperCase();

    return (

        <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-gradient-to-br from-gold-50 to-paper-line">
            <span className="font-display text-4xl font-semibold text-gold-600/70">
                {letter}
            </span>
        </div>
    );
}

export default function ProductCard({ product, onToggleWishlist, isWishlisted = false }) {
    const price = effectivePrice(product);
    const hasDiscount = Number(product.discount_price) > 0 && Number(product.discount_price) < Number(product.price);

    return (

        <div className="group relative rounded-2xl border border-paper-line bg-paper-raised p-3 shadow-card transition-shadow hover:shadow-pop">
            {onToggleWishlist ? (
                <button
                    type="button"
                    onClick={() => onToggleWishlist(product)}
                    className={[
                        "absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-paper-raised/90 shadow-card",
                        isWishlisted ? "text-plum-500" : "text-ink-muted hover:text-plum-500",
                    ].join(" ")}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
            ) : null}

            <Link to={`/products/${product.id}`}>
                <ProductImage product={product} />
                <div className="mt-3 space-y-1">
                    {product.brand ? (
                        <p className="text-xs uppercase tracking-wide text-ink-muted">{product.brand}</p>
                    ) : null}
                    <h3 className="line-clamp-2 font-display text-sm font-medium text-ink">{product.title}</h3>
                    <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-sm font-semibold text-ink">{formatPrice(price)}</span>
                        {hasDiscount ? (
                            <span className="text-xs text-ink-muted line-through">{formatPrice(product.price)}</span>
                        ) : null}
                    </div>
                </div>
            </Link>
            
        </div>
    );
}
