import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = forwardRef(function Input(
  { label, error, type = "text", className = "", hint, ...rest },
  ref,
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-medium text-ink-soft">{label}</span>
      ) : null}
      <span className="relative block">
        <input
          ref={ref}
          type={resolvedType}
          className={[
            "w-full rounded-xl border bg-paper-raised px-3.5 py-2.5 text-sm text-ink",
            "placeholder:text-ink-muted/70 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-gold-300 focus:border-gold-500",
            error ? "border-danger-500" : "border-paper-line",
            isPassword ? "pr-10" : "",
            className,
          ].join(" ")}
          {...rest}
        />
        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        ) : null}
      </span>
      {error ? (
        <span className="mt-1 block text-xs text-danger-500">{error}</span>
      ) : hint ? (
        <span className="mt-1 block text-xs text-ink-muted">{hint}</span>
      ) : null}
    </label>
  );
});

export default Input;
