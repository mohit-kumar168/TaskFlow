import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
}

const Input = ({ label, error, id, className = "", ...props }: InputProps) => {
	return (
		<div className="flex flex-col gap-2">
			<label
				htmlFor={id}
				className="text-sm font-medium text-gray-700"
			>
				{label}
			</label>

			<input
				id={id}
				className={`
					w-full rounded-lg border border-gray-300
					px-4 py-3
					text-sm
					outline-none
					transition-all
					focus:border-orange-500
					focus:ring-2
					focus:ring-orange-200
					${className}
				`}
				{...props}
			/>

			{error && (
				<p className="text-sm text-red-500">
					{error}
				</p>
			)}
		</div>
	);
};

export default Input;
