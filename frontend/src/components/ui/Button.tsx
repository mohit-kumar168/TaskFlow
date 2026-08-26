import type {
	ButtonHTMLAttributes,
	ReactNode,
} from "react";

interface ButtonProps
	extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?:
	| "primary"
	| "secondary"
	| "outline"
	| "ghost"
	| "danger";
	size?: "sm" | "md" | "lg";
}

const Button = ({
	children,
	variant = "primary",
	size = "md",
	className = "",
	...props
}: ButtonProps) => {
	const baseStyle =
		"inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:pointer-events-none disabled:opacity-50";

	const variants = {
		primary:
			"bg-orange-500 text-white hover:bg-orange-600",

		secondary:
			"border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",

		outline:
			"border border-gray-300 bg-transparent hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600",

		ghost:
			"text-gray-600 hover:bg-gray-100 hover:text-gray-900",

		danger:
			"bg-red-500 text-white hover:bg-red-600",
	};

	const sizes = {
		sm: "h-9 px-3 text-sm",
		md: "h-8 px-2 text-sm",
		lg: "h-8 px-2 text-sm",
	};

	return (
		<button
			className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
