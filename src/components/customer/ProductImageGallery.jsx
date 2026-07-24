// Customer Frontend
// Author: Nishtha

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Displays multiple product images with thumbnail navigation
// and previous/next controls similar to e-commerce websites.
export default function ProductImageGallery({ product }) {
    const images = product?.images || [];
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Reset to the first image whenever a different product loads.
    useEffect(() => {
        setSelectedIndex(0);
    }, [product?.id]);

    const hasImages = images.length > 0;

    function showPreviousImage() {
        setSelectedIndex((current) =>
            current === 0 ? images.length - 1 : current - 1,
        );
    }

    function showNextImage() {
        setSelectedIndex((current) =>
            current === images.length - 1 ? 0 : current + 1,
        );
    }

    return (
        <div className="space-y-4">

            <div className="group relative aspect-square overflow-hidden rounded-3xl border border-paper-line bg-white shadow-sm">

                {hasImages ? (
                    <>
                        <img
                            src={images[selectedIndex].image_url}
                            alt={product.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {images.length > 1 ? (
                            <>
                                <button
                                    type="button"
                                    onClick={showPreviousImage}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <button
                                    type="button"
                                    onClick={showNextImage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white"
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        ) : null}
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-gold-50 to-paper-line">
                        <span className="font-display text-7xl font-semibold text-gold-600/70">
                            {(product.title || "?").charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>

            {images.length > 1 ? (
                <div className="flex gap-3 overflow-x-auto pb-1">

                    {images.map((image, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setSelectedIndex(index)}
                            className={[
                                "h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition",
                                selectedIndex === index
                                    ? "border-teal-500"
                                    : "border-paper-line hover:border-teal-300",
                            ].join(" ")}
                        >
                            <img
                                src={image.image_url}
                                alt={`${product.title} ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </button>
                    ))}

                </div>
            ) : null}

        </div>
    );
}