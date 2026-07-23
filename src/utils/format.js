// Shared display formatting for the customer module. Prices in the DB are
// plain DECIMAL(10,2) values (no currency column), so we assume INR — the
// backend's default country on customer_addresses is "India".

export function formatPrice(value) {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

// Products carry both `price` and an optional `discount_price`. Treat
// discount_price as the effective price whenever it's a positive number
// lower than price — several places (cart, product card, order summary)
// need this same rule.
export function effectivePrice(product) {
  const price = Number(product?.price ?? 0);
  const discount = Number(product?.discount_price ?? 0);
  if (discount > 0 && discount < price) return discount;
  return price;
}

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
