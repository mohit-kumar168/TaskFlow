import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useWorkspaceStore } from "@/store/workspace.store";
import { useNavigate } from "react-router-dom";

interface WorkspaceSettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
	organizationSlug: string;
	workspaceSlug: string;
	onDeleted: () => void;
}

type WorkspaceFormData = {
	name: string;
	description: string;
};

const WorkspaceSettingsModal = ({
	isOpen,
	onClose,
	organizationSlug,
	workspaceSlug,
	onDeleted,
}: WorkspaceSettingsModalProps) => {
	const navigate = useNavigate();

	const {
		currentWorkspace,
		updateWorkspace,
		archiveWorkspace,
		isLoading,
	} = useWorkspaceStore();

	const [isDeleting, setIsDeleting] = useState(false);

	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<WorkspaceFormData>({
		defaultValues: {
			name: currentWorkspace?.name ?? "",
			description: currentWorkspace?.description ?? "",
		},
	});

	useEffect(() => {
		if (!isOpen || !currentWorkspace) {
			return;
		}

		reset({
			name: currentWorkspace.name,
			description: currentWorkspace.description ?? "",
		});

		setMessage(null);
	}, [isOpen, currentWorkspace, reset]);

	if (!isOpen || !currentWorkspace) {
		return null;
	}

	const handleUpdate = async (data: WorkspaceFormData) => {
		setMessage(null);

		const updatedWorkspace = await updateWorkspace(
			organizationSlug,
			workspaceSlug,
			{
				name: data.name.trim(),
				description: data.description.trim(),
			},
		);

		if (!updatedWorkspace) {
			setMessage({
				type: "error",
				text: "Failed to update workspace.",
			});

			return;
		}

		setMessage({
			type: "success",
			text: "Workspace updated successfully.",
		});

		reset({
			name: updatedWorkspace.name,
			description: updatedWorkspace.description ?? "",
		});
	};

	const handleDelete = async () => {
		const confirmed = window.confirm(
			`Are you sure you want to delete "${currentWorkspace.name}"?`,
		);

		if (!confirmed) {
			return;
		}

		try {
			setIsDeleting(true);
			setMessage(null);

			const deleted = await archiveWorkspace(
				organizationSlug,
				workspaceSlug,
			);

			if (!deleted) {
				setMessage({
					type: "error",
					text: "Failed to delete workspace.",
				});

				return;
			}

			onClose();
			onDeleted();
		} finally {
			setIsDeleting(false);
			navigate("/dashboard");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<button
				type="button"
				className="absolute inset-0 cursor-default"
				onClick={onClose}
			/>

			<div
				className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
					<h2 className="text-lg font-semibold text-gray-900">
						Workspace Settings
					</h2>

					<button
						type="button"
						onClick={onClose}
						className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
					>
						<X size={18} />
					</button>
				</div>

				<div className="max-h-[75vh] overflow-y-auto px-6 py-6">
					<form
						onSubmit={handleSubmit(handleUpdate)}
						className="space-y-5"
					>
						<Input
							id="workspace-name"
							label="Workspace Name"
							error={errors.name?.message}
							{...register("name", {
								required: "Workspace name is required.",
								minLength: {
									value: 3,
									message:
										"Workspace name must be at least 3 characters.",
								},
								maxLength: {
									value: 50,
									message:
										"Workspace name cannot exceed 50 characters.",
								},
							})}
						/>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="workspace-description"
								className="text-sm font-medium text-gray-700"
							>
								Description
							</label>

							<textarea
								id="workspace-description"
								rows={4}
								{...register("description", {
									maxLength: {
										value: 250,
										message:
											"Description cannot exceed 250 characters.",
									},
								})}
								className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
							/>

							{errors.description && (
								<p className="text-sm text-red-500">
									{errors.description.message}
								</p>
							)}
						</div>

						<div className="flex justify-end border-b border-gray-200 pb-6">
							<Button
								type="submit"
								disabled={isLoading || !isDirty}
								className="w-auto"
							>
								{isLoading ? "Saving..." : "Save Changes"}
							</Button>
						</div>
					</form>

					<div className="pt-6">
						<h3 className="text-sm font-semibold text-red-600">
							Delete Workspace
						</h3>

						<p className="mt-1 text-sm text-gray-500">
							Deleting this workspace will remove it from your
							organization.
						</p>

						<button
							type="button"
							onClick={handleDelete}
							disabled={isDeleting}
							className="mt-4 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isDeleting
								? "Deleting..."
								: "Delete Workspace"}
						</button>
					</div>

					{/* Feedback */}
					{message && (
						<p
							className={`mt-5 text-sm ${message.type === "success"
								? "text-green-600"
								: "text-red-500"
								}`}
						>
							{message.text}
						</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default WorkspaceSettingsModal;
