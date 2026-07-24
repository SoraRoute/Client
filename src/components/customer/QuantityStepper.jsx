// Customer Frontend
// Author: Nishtha

import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ value, onChange, min = 1, max = 99, disabled = false }) {

    // Keep the quantity within the allowed range.
    function step(delta) {
        const next = Math.min(max, Math.max(min, value + delta));
        if (next !== value) onChange(next);
    }

    return (

        <span className="inline-flex items-center rounded-lg border border-paper-line bg-paper-raised">

            <button
                type="button"
                disabled={disabled || value <= min}
                onClick={() => step(-1)}
                className="flex h-8 w-8 items-center justify-center text-ink-soft hover:bg-ink/5 disabled:opacity-40 disabled:hover:bg-transparent rounded-l-lg"
                aria-label="Decrease quantity"
            >
                <Minus size={14} />
            </button>

            {/* Current quantity */}
            <span className="w-8 text-center text-sm font-medium text-ink" aria-live="polite">
                {value}
            </span>

            <button
                type="button"
                disabled={disabled || value >= max}
                onClick={() => step(1)}
                className="flex h-8 w-8 items-center justify-center text-ink-soft hover:bg-ink/5 disabled:opacity-40 disabled:hover:bg-transparent rounded-r-lg"
                aria-label="Increase quantity"
            >
                <Plus size={14} />
            </button>

        </span>
    );
}