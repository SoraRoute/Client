import { useState } from "react";
import StarRating from "./StarRating";
import Button from "../common/Button";

export default function ReviewForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
  const [rating, setRating] = useState(initialValues?.rating || 0);
  const [comment, setComment] = useState(initialValues?.comment || "");

  function handleSubmit(e) {
    e.preventDefault();
    if (!rating) return;
    onSubmit({ rating, comment });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-paper-line bg-paper-raised p-4">
      <div>
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">Your rating</span>
        <StarRating value={rating} onChange={setRating} size={22} />
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product…"
        rows={3}
        className="w-full rounded-xl border border-paper-line bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-300"
      />
      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!rating}>
          {initialValues ? "Update review" : "Submit review"}
        </Button>
      </div>
    </form>
  );
}
