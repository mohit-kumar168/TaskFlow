import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface AddProjectMemberModalProps {
	isOpen: boolean;
	isLoading?: boolean;
	onClose: () => void;
	onSubmit: (data: {
		email: string;
		role: "ADMIN" | "MEMBER";
	}) => void;
}

const AddProjectMemberModal = ({
	isOpen,
	isLoading = false,
	onClose,
	onSubmit,
}: AddProjectMemberModalProps) => {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<"ADMIN" | "MEMBER">(
		"MEMBER",
	);

	useEffect(() => {
		if (isOpen) {
			setEmail("");
			setRole("MEMBER");
		}
	}, [isOpen]);

	if (!isOpen) {
		return null;
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		const trimmedEmail = email.trim();

		if (!trimmedEmail) {
			return;
		}

		onSubmit({
			email: trimmedEmail,
			role,
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div className="w-full max-w-md rounded-xl bg-white shadow-xl">
				<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
					<div>
						<h2 className="text-lg font-semibold text-gray-900">
							Add project member
						</h2>

						<p className="mt-1 text-sm text-gray-500">
							Add a workspace member to this project.
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						disabled={isLoading}
						className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
					>
						<X size={18} />
					</button>
				</div>

				<form onSubmit={handleSubmit}>
					<div className="space-y-5 px-6 py-5">
						<div>
							<label
								htmlFor="project-member-email"
								className="mb-2 block text-sm font-medium text-gray-700"
							>
								Email
							</label>

							<input
								id="project-member-email"
								type="email"
								value={email}
								onChange={(event) =>
									setEmail(event.target.value)
								}
								placeholder="member@example.com"
								disabled={isLoading}
								className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
								required
							/>
						</div>

						<div>
							<label
								htmlFor="project-member-role"
								className="mb-2 block text-sm font-medium text-gray-700"
							>
								Role
							</label>

							<select
								id="project-member-role"
								value={role}
								onChange={(event) =>
									setRole(
										event.target.value as
										| "ADMIN"
										| "MEMBER",
									)
								}
								disabled={isLoading}
								className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-gray-100"
							>
								<option value="MEMBER">
									Member
								</option>

								<option value="ADMIN">
									Admin
								</option>
							</select>
						</div>
					</div>

					<div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
						<button
							type="button"
							onClick={onClose}
							disabled={isLoading}
							className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
						>
							Cancel
						</button>

						<button
							type="submit"
							disabled={
								isLoading ||
								!email.trim()
							}
							className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isLoading
								? "Adding..."
								: "Add member"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddProjectMemberModal;
