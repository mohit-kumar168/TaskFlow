import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: "primary" | "outline" | "outline_light";
}

const Button = ({
	children,
	variant = "primary",
	className = "",
	...props
}: ButtonProps) => {
	const baseStyle =
		"w-full rounded-lg px-4 py-3 font-semibold transition-all duration-200";

	const variants = {
		primary:
			"bg-orange-500 text-white hover:bg-orange-600 active:scale-95",

		outline:
			"border border-white text-white hover:bg-white hover:text-orange-500 active:scale-95",

		outline_light:
			"border border-gray-200 text-gray-600 hover:bg-gray-200 hover:text-orange-500",
	};

	return (
		<button
			className={`${baseStyle} ${variants[variant]} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
};

export default Button;
