import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export interface AddMemberFormData {
	email: string;
	role: string;
}

interface MemberRoleOption {
	value: string;
	label: string;
}

interface AddMemberModalProps {
	isOpen: boolean;
	isSubmitting: boolean;
	roles: MemberRoleOption[];
	onClose: () => void;
	onSubmit: (data: AddMemberFormData) => void;
}

const AddMemberModal = ({
	isOpen,
	isSubmitting,
	roles,
	onClose,
	onSubmit,
}: AddMemberModalProps) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<AddMemberFormData>({
		defaultValues: {
			email: "",
			role: roles[0]?.value ?? "",
		},
	});

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		reset({
			email: "",
			role: roles[0]?.value ?? "",
		});
	}, [isOpen, roles, reset]);

	if (!isOpen) {
		return null;
	}

	const handleFormSubmit = (data: AddMemberFormData) => {
		onSubmit({
			email: data.email.trim(),
			role: data.role,
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<button
				type="button"
				aria-label="Close add member modal"
				className="absolute inset-0 cursor-default"
				onClick={onClose}
				disabled={isSubmitting}
			/>

			<div
				className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
					<div>
						<h2 className="text-lg font-semibold text-gray-900">
							Add Member
						</h2>

						<p className="mt-1 text-sm text-gray-500">
							Add a member to this team.
						</p>
					</div>

					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<X size={18} />
					</button>
				</div>

				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className="space-y-5 px-6 py-6"
				>
					<Input
						id="member-email"
						type="email"
						label="Email"
						placeholder="member@example.com"
						error={errors.email?.message}
						disabled={isSubmitting}
						{...register("email", {
							required: "Member email is required.",
							pattern: {
								value:
									/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message:
									"Please enter a valid email address.",
							},
						})}
					/>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="member-role"
							className="text-sm font-medium text-gray-700"
						>
							Role
						</label>

						<select
							id="member-role"
							disabled={isSubmitting || roles.length === 0}
							{...register("role", {
								required: "Member role is required.",
							})}
							className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:bg-gray-50"
						>
							{roles.map((role) => (
								<option
									key={role.value}
									value={role.value}
								>
									{role.label}
								</option>
							))}
						</select>

						{errors.role && (
							<p className="text-sm text-red-500">
								{errors.role.message}
							</p>
						)}
					</div>

					<div className="flex justify-end gap-3 pt-2">
						<button
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
							className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Cancel
						</button>

						<Button
							type="submit"
							disabled={
								isSubmitting ||
								roles.length === 0
							}
							className="w-auto"
						>
							{isSubmitting
								? "Adding..."
								: "Add Member"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddMemberModal;
