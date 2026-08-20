import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useWorkspaceStore } from "@/store/workspace.store";

type WorkspaceFormData = {
	name: string;
	description: string;
};

const WorkspaceSettings = () => {
	const navigate = useNavigate();

	const { organizationSlug, workspaceSlug } = useParams<{
		organizationSlug: string;
		workspaceSlug: string;
	}>();

	const {
		currentWorkspace,
		updateWorkspace,
		archiveWorkspace,
		isLoading,
	} = useWorkspaceStore();

	const [isEditing, setIsEditing] = useState(false);
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
		reset({
			name: currentWorkspace?.name ?? "",
			description: currentWorkspace?.description ?? "",
		});
	}, [currentWorkspace, reset]);

	const handleUpdate = async (
		data: WorkspaceFormData,
	) => {
		if (!organizationSlug || !workspaceSlug) {
			return;
		}

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

		setIsEditing(false);

		setMessage({
			type: "success",
			text: "Workspace updated successfully.",
		});
	};

	const handleCancelEdit = () => {
		reset({
			name: currentWorkspace?.name ?? "",
			description: currentWorkspace?.description ?? "",
		});

		setIsEditing(false);
		setMessage(null);
	};

	const handleDeleteWorkspace = async () => {
		if (!organizationSlug || !workspaceSlug || !currentWorkspace) {
			return;
		}

		const confirmed = window.confirm(
			`Are you sure you want to delete "${currentWorkspace.name}"? This action cannot be undone.`,
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

			navigate(`/organizations/${organizationSlug}`);
		} finally {
			setIsDeleting(false);
		}
	};

	if (!currentWorkspace) {
		return (
			<div className="text-sm text-gray-500">
				No workspace selected.
			</div>
		);
	}

	return (
		<div className="max-w-3xl">
			{/* Header */}
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-base font-semibold text-gray-900">
						Workspace
					</h3>

					<p className="mt-1 text-sm text-gray-500">
						Manage your workspace's basic information.
					</p>
				</div>

				{!isEditing && (
					<button
						type="button"
						onClick={() => {
							setIsEditing(true);
							setMessage(null);
						}}
						className="rounded-full p-2 text-sm font-medium text-orange-500 hover:bg-gray-100 hover:text-orange-600"
					>
						Edit
					</button>
				)}
			</div>

			<div className="mt-6">
				{isEditing ? (
					<form
						onSubmit={handleSubmit(handleUpdate)}
						className="space-y-6"
					>
						<Input
							id="name"
							label="Workspace Name"
							error={errors.name?.message}
							{...register("name", {
								required: "Workspace name is required.",
								minLength: {
									value: 2,
									message:
										"Workspace name must be at least 2 characters.",
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
								htmlFor="description"
								className="text-sm font-medium text-gray-700"
							>
								Description
							</label>

							<textarea
								id="description"
								rows={4}
								{...register("description", {
									maxLength: {
										value: 250,
										message:
											"Description cannot exceed 250 characters.",
									},
								})}
								className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
							/>

							{errors.description && (
								<p className="text-sm text-red-500">
									{errors.description.message}
								</p>
							)}
						</div>

						<div className="flex gap-3">
							<Button
								type="submit"
								disabled={isLoading || !isDirty}
								className="w-auto"
							>
								{isLoading ? "Saving..." : "Save Changes"}
							</Button>

							<button
								type="button"
								onClick={handleCancelEdit}
								disabled={isLoading}
								className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
							>
								Cancel
							</button>
						</div>
					</form>
				) : (
					<div className="space-y-6">
						<div>
							<p className="text-xs font-medium text-gray-500">
								Workspace Name
							</p>

							<p className="mt-1 text-sm text-gray-900">
								{currentWorkspace.name}
							</p>
						</div>

						<div>
							<p className="text-xs font-medium text-gray-500">
								Description
							</p>

							<p className="mt-1 text-sm text-gray-900">
								{currentWorkspace.description ||
									"No description provided."}
							</p>
						</div>
					</div>
				)}
			</div>

			{message && (
				<p
					className={`mt-6 text-sm ${message.type === "success"
						? "text-green-600"
						: "text-red-500"
						}`}
				>
					{message.text}
				</p>
			)}

			{/* Danger Zone */}
			<div className="mt-12 border-t border-gray-200 pt-8">
				<h3 className="text-base font-semibold text-red-600">
					Danger Zone
				</h3>

				<p className="mt-1 text-sm text-gray-500">
					Deleting this workspace will remove it from your
					organization.
				</p>

				<button
					type="button"
					onClick={handleDeleteWorkspace}
					disabled={isDeleting}
					className="mt-4 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isDeleting ? "Deleting..." : "Delete Workspace"}
				</button>
			</div>
		</div>
	);
};

export default WorkspaceSettings;
