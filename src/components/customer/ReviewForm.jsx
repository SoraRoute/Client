// Customer Frontend
// Author: Nishtha

import { useState } from "react";
import StarRating from "./StarRating";
import Button from "../common/Button";

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function ReviewForm({ initialValues, onSubmit, onCancel, isSubmitting }) {
    // Pre-fill values when editing an existing review.
    const [rating, setRating] = useState(initialValues?.rating || 0);
    const [comment, setComment] = useState(initialValues?.comment || "");

    function handleSubmit(e) {
        e.preventDefault();
        if (!rating) return;
        onSubmit({ rating, comment });
    }

    return (

        <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-paper-line bg-white p-6 shadow-sm sm:p-7"
        >

            {/* Form heading changes for create vs edit */}
            <h3 className="font-display text-lg font-bold text-ink">
                {initialValues ? "Update your review" : "Write your review"}
            </h3>

            <p className="mt-1 text-sm text-ink-muted">
                Share honest feedback to help other shoppers decide.
            </p>

            {/* Rating selector */}
            <div className="mt-5 rounded-2xl border border-paper-line bg-paper-raised/60 px-5 py-4">

                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Your rating
                </span>

                <div className="flex items-center gap-3">
                    <StarRating value={rating} onChange={setRating} size={28} />

                    <span className="min-w-[5.5rem] text-sm font-semibold text-gold-700">
                        {RATING_LABELS[rating] || ""}
                    </span>
                </div>

            </div>

            {/* Optional review message */}
            <div className="mt-4">

                <label htmlFor="review-comment" className="mb-1.5 block text-sm font-medium text-ink-soft">
                    Your review <span className="font-normal text-ink-muted">(optional)</span>
                </label>

                <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="What did you like or dislike? How did you use this product?"
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-paper-line bg-paper px-4 py-3 text-sm leading-relaxed text-ink placeholder:text-ink-muted/70 transition-shadow duration-150 focus:border-gold-500 focus:outline-none focus:ring-4 focus:ring-gold-100"
                />

            </div>

            {/* Form actions */}
            <div className="mt-5 flex flex-col-reverse gap-2.5 sm:flex-row sm:items-center sm:justify-end">

                {onCancel ? (
                    <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="sm:w-auto">
                        Cancel
                    </Button>
                ) : null}

                <Button
                    type="submit"
                    size="sm"
                    isLoading={isSubmitting}
                    disabled={!rating}
                    className="justify-center shadow-sm sm:w-auto"
                >
                    {initialValues ? "Update review" : "Submit review"}
                </Button>

            </div>
        </form>
    );
}