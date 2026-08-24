import { X } from "lucide-react";

interface MemberActionModalProps {
	isOpen: boolean;
	memberName: string;
	onClose: () => void;
	onChangeRole: () => void;
	onRemove: () => void;
}

const MemberActionModal = ({
	isOpen,
	memberName,
	onClose,
	onChangeRole,
	onRemove,
}: MemberActionModalProps) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<button
				type="button"
				className="absolute inset-0 cursor-default"
				onClick={onClose}
				aria-label="Close modal"
			/>

			<div
				className="relative z-10 w-full max-w-sm rounded-xl bg-white shadow-xl"
				onClick={(event) => event.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
					<div>
						<h2 className="text-lg font-semibold text-gray-900">
							Member Actions
						</h2>

						<p className="mt-1 text-sm text-gray-500">
							Manage {memberName}'s membership.
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
					>
						<X size={18} />
					</button>
				</div>

				{/* Actions */}
				<div className="space-y-2 px-6 py-5">
					<button
						type="button"
						onClick={onChangeRole}
						className="w-full rounded-lg border border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
					>
						Change Role
					</button>

					<button
						type="button"
						onClick={onRemove}
						className="w-full rounded-lg border border-red-200 px-4 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
					>
						Remove Member
					</button>
				</div>

				{/* Footer */}
				<div className="flex justify-end border-t border-gray-200 px-6 py-4">
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

export default MemberActionModal;
