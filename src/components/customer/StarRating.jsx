import { Star } from "lucide-react";

export default function StarRating({ value = 0, onChange, size = 16 }) {
  const isInteractive = typeof onChange === "function";
  const stars = [1, 2, 3, 4, 5];

  return (
    <span className="inline-flex items-center gap-0.5">
      {stars.map((star) => {
        const filled = star <= Math.round(value);
        const Star_ = Star;
        return isInteractive ? (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-gold-500 hover:scale-110 transition-transform"
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            <Star_ size={size} fill={filled ? "currentColor" : "none"} strokeWidth={1.75} />
          </button>
        ) : (
          <Star_
            key={star}
            size={size}
            fill={filled ? "currentColor" : "none"}
            strokeWidth={1.75}
            className="text-gold-500"
          />
        );
      })}
    </span>
  );
}
