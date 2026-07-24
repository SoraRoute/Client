// Hexagon-shaped loading spinner used throughout the application.
export default function Loader({ fullScreen = false, label = "Loading…", size = 28 }) {
    // Reusable spinner content.
    const spinner = (
        <div className="flex flex-col items-center gap-3">
            <svg
                width={size}
                height={size}
                viewBox="0 0 32 32"
                className="animate-spin"
                style={{ animationDuration: "0.9s" }}
            >
                <polygon
                    points="16,2 29,9 29,23 16,30 3,23 3,9"
                    fill="none"
                    stroke="#E5E3DB"
                    strokeWidth="3"
                />

                {/* Highlighted edge to create the spinning effect */}
                <polygon
                    points="16,2 29,9 29,23"
                    fill="none"
                    stroke="#D89A1F"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>

            {label ? <p className="text-sm text-ink-muted font-body">{label}</p> : null}
        </div>
    );

    // Render only the spinner when a full-screen loader isn't needed.
    if (!fullScreen) return spinner;

    return (
        <div className="min-h-[40vh] w-full flex items-center justify-center py-16">
            {spinner}
        </div>
    );
}