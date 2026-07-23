import { forwardRef } from "react";
import Loader from "./Loader";

// Different button styles used across the application.
const VARIANT_CLASSES = {
	gold: "bg-gold-500 text-ink hover:bg-gold-600 focus-visible:outline-gold-600",
	teal: "bg-teal-500 text-white hover:bg-teal-600 focus-visible:outline-teal-600",
	plum: "bg-plum-500 text-white hover:bg-plum-600 focus-visible:outline-plum-600",
	ink: "bg-ink text-paper hover:bg-ink-soft focus-visible:outline-ink",
	outline: "bg-transparent text-ink border border-ink/20 hover:border-ink/40",
	ghost: "bg-transparent text-ink hover:bg-ink/5",
	danger: "bg-danger-500 text-white hover:bg-danger-600 focus-visible:outline-danger-600",
};

// Predefined button sizes.
const SIZE_CLASSES = {
	sm: "text-sm px-3 py-1.5 rounded-lg gap-1.5",
	md: "text-sm px-4 py-2.5 rounded-xl gap-2",
	lg: "text-base px-6 py-3 rounded-xl gap-2",
};

const Button = forwardRef(function Button(
	{
		children,
		variant = "gold",
		size = "md",
		isLoading = false,
		disabled = false,
		fullWidth = false,
		type = "button",
		className = "",
		icon: Icon,
		...rest
	},
	ref,
) {
	return (
		<button
			ref={ref}
			type={type}
			// Disable the button while loading or when explicitly disabled.
			disabled={disabled || isLoading}
			className={[
				"inline-flex items-center justify-center font-medium tracking-tight transition-colors duration-150",
				"disabled:opacity-50 disabled:cursor-not-allowed",
				VARIANT_CLASSES[variant],
				SIZE_CLASSES[size],
				fullWidth ? "w-full" : "",
				className,
			].join(" ")}
			{...rest}
		>
			{/* Show loader while the action is in progress. */}
			{isLoading ? (
				<Loader size={16} label="" />
			) : (
				<>
					{/* Render an icon if one is provided. */}
					{Icon ? <Icon size={16} strokeWidth={2} /> : null}
					{children}
				</>
			)}
		</button>
	);
});

export default Button;