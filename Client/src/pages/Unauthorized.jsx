import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function Unauthorized() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <span className="font-mono text-sm text-ink-muted">403</span>
      <h1 className="font-display text-3xl font-semibold">Access denied</h1>
      <p className="max-w-sm text-sm text-ink-muted">
        You don't have permission to view this page with your current account.
      </p>
      <Link to="/">
        <Button variant="ink">Back to home</Button>
      </Link>
    </div>
  );
}
