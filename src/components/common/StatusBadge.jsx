// Color styles for different status values.
const STATUS_STYLES = {
    PLACED: "bg-gold-50 text-gold-700",
    CONFIRMED: "bg-teal-50 text-teal-700",
    SHIPPED: "bg-teal-100 text-teal-700",
    DELIVERED: "bg-teal-50 text-teal-700",
    CANCELLED: "bg-danger-50 text-danger-600",
    PENDING: "bg-gold-50 text-gold-700",
    SUCCESS: "bg-teal-50 text-teal-700",
    FAILED: "bg-danger-50 text-danger-600",
    ACTIVE: "bg-teal-50 text-teal-700",
    INACTIVE: "bg-ink/5 text-ink-soft",
    SUSPENDED: "bg-danger-50 text-danger-600",
};

export default function StatusBadge({ status }) {
    // Use a default style if the status isn't defined.
    const style = STATUS_STYLES[status] || "bg-ink/5 text-ink-soft";

    return (
        <span
            className={[
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-wide",
                style,
            ].join(" ")}
        >
            {status || "UNKNOWN"}
        </span>
    );
}