import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: "primary" | "outline";
}

const Button = ({
	children,
	variant = "primary",
	className = "",
	...props
}: ButtonProps) => {
	const baseStyle =
		"w-full rounded-lg px-4 py-3 font-semibold transition-all duration-200 cursor-pointer";

	const variants = {
		primary:
			"bg-orange-500 text-white hover:bg-orange-600 active:scale-95",

		outline:
			"border border-white text-white hover:bg-white hover:text-orange-500 active:scale-95",
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
