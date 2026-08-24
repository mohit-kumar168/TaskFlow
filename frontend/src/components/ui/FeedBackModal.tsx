import { CheckCircle2, XCircle, X } from "lucide-react";

interface FeedbackModalProps {
	isOpen: boolean;
	type: "success" | "error";
	title: string;
	message: string;
	onClose: () => void;
}

const FeedbackModal = ({
	isOpen,
	type,
	title,
	message,
	onClose,
}: FeedbackModalProps) => {
	if (!isOpen) {
		return null;
	}

	const isSuccess = type === "success";

	return (
		<div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 px-4">
			<button
				type="button"
				className="absolute inset-0 cursor-default"
				onClick={onClose}
			/>

			<div
				className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
				onClick={(event) => event.stopPropagation()}
			>
				<button
					type="button"
					onClick={onClose}
					className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
				>
					<X size={18} />
				</button>

				<div className="flex flex-col items-center text-center">
					<div
						className={`flex h-12 w-12 items-center justify-center rounded-full ${isSuccess
								? "bg-green-50 text-green-600"
								: "bg-red-50 text-red-600"
							}`}
					>
						{isSuccess ? (
							<CheckCircle2 size={26} />
						) : (
							<XCircle size={26} />
						)}
					</div>

					<h2 className="mt-4 text-base font-semibold text-gray-900">
						{title}
					</h2>

					<p className="mt-2 text-sm text-gray-500">
						{message}
					</p>

					<button
						type="button"
						onClick={onClose}
						className={`mt-5 rounded-lg px-5 py-2 text-sm font-medium text-white ${isSuccess
								? "bg-green-600 hover:bg-green-700"
								: "bg-red-600 hover:bg-red-700"
							}`}
					>
						Okay
					</button>
				</div>
			</div>
		</div>
	);
};

export default FeedbackModal;
