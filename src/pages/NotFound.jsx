// Shared Module
// Authors: Nishtha & Pinki

import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFound() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
            {/* Fallback page for unknown routes */}
            <span className="font-mono text-sm text-ink-muted">404</span>

            <h1 className="font-display text-3xl font-semibold">
                Page not found
            </h1>

            <p className="max-w-sm text-sm text-ink-muted">
                The page you're looking for doesn't exist or may have moved.
            </p>

            <Link to="/">
                <Button variant="ink">Back to home</Button>
            </Link>
        </div>
    );
}