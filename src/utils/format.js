// Format a number as Indian currency.
export function formatPrice(value) {
    const amount = Number(value);
    if (Number.isNaN(amount)) return "—";

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(amount);
}

// Return the discounted price if available; otherwise use the original price.
export function effectivePrice(product) {
    const price = Number(product?.price ?? 0);
    const discount = Number(product?.discount_price ?? 0);

    if (discount > 0 && discount < price) return discount;
    return price;
}

// Format a date into a readable format.
export function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}