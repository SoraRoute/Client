export default function StatCard({ icon: Icon, label, value, accent = "gold" }) {

    const accentClass =
        accent === "teal"
            ? "bg-teal-50 text-teal-600"
            : accent === "plum"
                ? "bg-plum-50 text-plum-600"
                : "bg-gold-50 text-gold-600";

    return (

        <div className="rounded-2xl border border-paper-line bg-paper-raised p-5">

            <div className="flex items-center gap-3">

                {Icon ? (

                    <span className={`flex h-9 w-9 items-center justify-center rounded-full ${accentClass}`}>
                        <Icon size={17} strokeWidth={1.9} />
                    </span>
                ) : null}

                <span className="text-sm text-ink-muted">{label}</span>

            </div>

            <p className="mt-3 font-display text-2xl font-semibold text-ink">{value}</p>
            
        </div>
    );
}
