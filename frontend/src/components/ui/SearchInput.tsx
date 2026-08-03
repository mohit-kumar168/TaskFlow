import { Search } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
	placeholder?: string;
}

const SearchInput = ({
	placeholder = "Search...",
	className = "",
	...props
}: SearchInputProps) => {
	return (
		<div className="w-full flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 transition-all duration-100 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
			<Search
				size={18}
				className="text-gray-400 flex-shrink-0"
			/>

			<input
				type="text"
				placeholder={placeholder}
				className={`w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 ${className}`}
				{...props}
			/>
		</div>
	);
};

export default SearchInput;
