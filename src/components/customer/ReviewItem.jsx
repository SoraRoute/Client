import { Pencil, Trash2 } from "lucide-react";
import StarRating from "./StarRating";
import { formatDate } from "../../utils/format";

const AVATAR_PALETTE = [
    "from-gold-400 to-gold-600",
    "from-teal-400 to-teal-600",
    "from-plum-400 to-plum-600",
    "from-orange-400 to-orange-600",
    "from-emerald-400 to-emerald-600",
];

// Reviewer identity can live under a few different keys depending on how the
// review was serialized (populated user object vs. flat fields) — read
// defensively so the card never renders a blank name.
function reviewerName(review) {
    return (
        review?.user_name ??
        review?.customer_name ??
        review?.user?.name ??
        review?.name ??
        "Verified Buyer"
    );
}

function initials(name) {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function paletteFor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) % AVATAR_PALETTE.length;
    return AVATAR_PALETTE[hash];
}

export default function ReviewItem({ review, isOwn, onEdit, onDelete }) {
    const name = reviewerName(review);

    return (
        <div className="group relative px-5 py-5 transition-colors duration-200 sm:px-6 sm:py-6">
            <div className="flex items-start gap-4">
                <div
                    className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow-sm",
                        paletteFor(name),
                    ].join(" ")}
                    aria-hidden="true"
                >
                    {initials(name)}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                        <div>
                            <p className="text-sm font-semibold text-ink">
                                {name}
                                {isOwn ? (
                                    <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold-700">
                                        You
                                    </span>
                                ) : null}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                                <StarRating value={review.rating} />
                                <span className="text-xs text-ink-muted">{formatDate(review.created_at)}</span>
                            </div>
                        </div>

                        {isOwn ? (
                            <div className="flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
                                <button
                                    type="button"
                                    onClick={() => onEdit(review)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-gold-50 hover:text-gold-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-300"
                                    aria-label="Edit review"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete(review)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-danger-50 hover:text-danger-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger-300"
                                    aria-label="Delete review"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ) : null}
                    </div>

                    {review.comment ? (
                        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{review.comment}</p>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
