import { Pencil, Trash2 } from "lucide-react";
import StarRating from "./StarRating";
import { formatDate } from "../../utils/format";

export default function ReviewItem({ review, isOwn, onEdit, onDelete }) {
  return (
    <div className="border-b border-paper-line py-4 last:border-none">
      <div className="flex items-start justify-between gap-3">
        <div>
          <StarRating value={review.rating} />
          <p className="mt-1 text-xs text-ink-muted">{formatDate(review.created_at)}</p>
        </div>
        {isOwn ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(review)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink"
              aria-label="Edit review"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(review)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-danger-50 hover:text-danger-500"
              aria-label="Delete review"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : null}
      </div>
      {review.comment ? <p className="mt-2 text-sm text-ink-soft">{review.comment}</p> : null}
    </div>
  );
}
