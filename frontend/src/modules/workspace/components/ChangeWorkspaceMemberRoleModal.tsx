import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import { type WorkspaceMemberProps } from "@/api/workspace.api";

interface ChangeWorkspaceMemberRoleModalProps {
	isOpen: boolean;
	member: WorkspaceMemberProps | null;
	isSubmitting: boolean;
	onClose: () => void;
	onSubmit: (role: "ADMIN" | "MEMBER") => void;
}

const ChangeWorkspaceMemberRoleModal = ({
	isOpen,
	member,
	isSubmitting,
	onClose,
	onSubmit,
}: ChangeWorkspaceMemberRoleModalProps) => {
	const [role, setRole] = useState<
		"ADMIN" | "MEMBER"
	>("MEMBER");

	useEffect(() => {
		if (member) {
			setRole(
				member.role === "ADMIN"
					? "ADMIN"
					: "MEMBER",
			);
		}
	}, [member]);

	if (!isOpen || !member) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
				<div>
					<h2 className="text-lg font-semibold text-gray-900">
						Change Member Role
					</h2>

					<p className="mt-1 text-sm text-gray-500">
						Change the workspace role for{" "}
						<span className="font-medium text-gray-700">
							{member.user.name}
						</span>
						.
					</p>
				</div>

				<div className="mt-6">
					<label
						htmlFor="workspace-member-role"
						className="text-sm font-medium text-gray-700"
					>
						Role
					</label>

					<select
						id="workspace-member-role"
						value={role}
						onChange={(event) =>
							setRole(
								event.target.value as
								| "ADMIN"
								| "MEMBER",
							)
						}
						disabled={isSubmitting}
						className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-100"
					>
						<option value="MEMBER">Member</option>
						<option value="ADMIN">Admin</option>
					</select>
				</div>

				<div className="mt-6 flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
					>
						Cancel
					</button>

					<Button
						type="button"
						onClick={() => onSubmit(role)}
						disabled={isSubmitting}
						className="w-auto"
					>
						{isSubmitting
							? "Updating..."
							: "Update Role"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ChangeWorkspaceMemberRoleModal;
