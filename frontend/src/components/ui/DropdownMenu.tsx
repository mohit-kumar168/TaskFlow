import { MoreVertical, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface DropdownItem {
	label: string;
	icon?: LucideIcon;
	onClick: () => void;
	danger: boolean;
}

interface DropdownMenuProps {
	items: DropdownItem[];
}

const DropdownMenu = ({ items }: DropdownMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e?.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [])
	return (
		<div className="relative" ref={dropdownRef}>
			<button type="button" onClick={() => setIsOpen(prev => !prev)} className="rounded-md p-1 transition hover:bg-gray-100">
				<MoreVertical size={18} />
			</button>
			{isOpen && (
				<div className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
					{items.map((item) => {
						const Icon = item.icon;

						return (
							<button
								key={item.label}
								type="button"
								onClick={() => {
									item.onClick();
									setIsOpen(false);
								}}
								className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition hover:bg-gray-100 ${item.danger ? "text-red-600" : "text-gray-700"}`}
							>
								{Icon && <Icon size={16} />}
								<span>{item.label}</span>
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default DropdownMenu;
