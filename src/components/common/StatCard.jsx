// Shared Module
// Authors: Nishtha & Pinki

export default function StatCard({ icon: Icon, label, value, accent = "gold" }) {

    // Choose the icon color based on the selected accent.
    const accentClass =
        accent === "teal"
            ? "bg-teal-50 text-teal-600"
            : accent === "plum"
                ? "bg-plum-50 text-plum-600"
                : "bg-gold-50 text-gold-600";

    return (
        <div
            className="
                rounded-2xl
                border
                border-paper-line
                bg-paper-raised
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-teal-100
                hover:shadow-lg
            "
        >
        <div className="flex items-center gap-3">

            {/* Optional icon */}
            {Icon ? (
                <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full ${accentClass}`}
                >
                    <Icon size={17} strokeWidth={1.9} />
                </span>
            ) : null}

            <span className="text-sm text-ink-muted">
                {label}
            </span>

        </div>

            {/* Display the statistic value */}
            <p className="mt-3 font-display text-2xl font-semibold text-ink">
                {value}
            </p>

        </div>
    );
}