import { Link } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { formatDate } from "../../utils/format";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import Loader from "../../components/common/Loader";

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-0.5 text-sm text-ink">{value || "—"}</p>
    </div>
  );
}

export default function Profile() {
  useDocumentTitle("Your profile");
  const { user, isLoading } = useAdminAuth();

  if (isLoading || !user) return <Loader fullScreen label="Loading your profile…" />;

  return (
    <div className="mx-auto max-w-md space-y-8">
      <h1 className="font-display text-2xl font-semibold text-ink">Your profile</h1>

      <div className="rounded-2xl border border-paper-line bg-paper-raised p-6">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First name" value={user.first_name} />
          <Field label="Last name" value={user.last_name} />
          <Field label="Email" value={user.email} />
          <Field label="Mobile" value={user.mobile} />
          <Field label="Role" value={user.role} />
          <Field label="Admin since" value={formatDate(user.created_at)} />
        </div>
      </div>

      <Link
        to="/admin/change-password"
        className="flex items-center gap-2 text-sm font-medium text-plum-600 hover:text-plum-700"
      >
        <KeyRound size={16} /> Change password
      </Link>
    </div>
  );
}
