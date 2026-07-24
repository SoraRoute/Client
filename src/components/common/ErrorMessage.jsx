// Shared Module
// Authors: Nishtha & Pinki

import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ message = "Something went wrong.", onRetry }) {
    return (

        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-danger-50 bg-danger-50/50 px-6 py-10 text-center">

            {/* Error icon */}
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-50 text-danger-500">
                <AlertTriangle size={20} strokeWidth={1.75} />
            </span>

            <p className="max-w-sm text-sm text-ink-soft">{message}</p>

            {/* Allow retry when the parent provides a handler */}
            {onRetry ? (

                <button
                    onClick={onRetry}
                    className="text-sm font-medium text-teal-600 underline underline-offset-2 hover:text-teal-700"
                >
                    Try again
                </button>

            ) : null}

        </div>
    );
}