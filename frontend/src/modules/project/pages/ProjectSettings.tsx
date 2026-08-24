import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useProjectStore } from "@/store/project.store";
import FeedbackModal from "@/components/ui/FeedBackModal";

type ProjectSettingsFormData = {
	name: string;
	description: string;
};

interface ProjectSettingsProps {
	isOpen: boolean;
	onClose: () => void;
	organizationSlug: string;
	workspaceSlug: string;
	projectSlug: string;
}

const ProjectSettings = ({
	isOpen,
	onClose,
	organizationSlug,
	workspaceSlug,
	projectSlug,
}: ProjectSettingsProps) => {
	const {
		currentProject,
		updateProject,
		archiveProject,
		isProjectLoading,
	} = useProjectStore();

	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const [feedback, setFeedback] = useState({ isOpen: false, type: "success" as "success" | "error", title: "", message: "" });

	const [isArchiving, setIsArchiving] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<ProjectSettingsFormData>({
		defaultValues: {
			name: currentProject?.name ?? "",
			description: currentProject?.description ?? "",
		},
	});

	useEffect(() => {
		if (currentProject) {
			reset({
				name: currentProject.name,
				description: currentProject.description ?? "",
			});
		}
	}, [currentProject, reset]);

	if (!isOpen || !currentProject) {
		return null;
	}

	const handleUpdate = async (
		data: ProjectSettingsFormData,
	) => {
		setMessage(null);

		const updatedProject = await updateProject(
			organizationSlug,
			workspaceSlug,
			projectSlug,
			{
				name: data.name.trim(),
				description: data.description.trim(),
			},
		);

		if (!updatedProject) {
			setFeedback({ isOpen: true, type: "error", title: "Update Failed", message: "Unable to update the project." });
			setMessage({
				type: "error",
				text: "Failed to update project.",
			});

			return;
		}

		reset({
			name: updatedProject.name,
			description: updatedProject.description ?? "",
		});

		setMessage({
			type: "success",
			text: "Project updated successfully.",
		});
		setFeedback({ isOpen: true, type: "success", title: "Project Updated", message: "Project updated successfully." });
	};

	const handleArchive = async () => {
		const confirmed = window.confirm(
			`Are you sure you want to delete "${currentProject.name}"?`,
		);

		if (!confirmed) {
			return;
		}

		try {
			setIsArchiving(true);
			setMessage(null);

			const deleted = await archiveProject(
				organizationSlug,
				workspaceSlug,
				projectSlug,
			);

			if (!deleted) {
				setFeedback({ isOpen: true, type: "error", title: "Deletion Failed", message: "Unable to delete the project." });
				setMessage({
					type: "error",
					text: "Failed to delete project.",
				});

				return;
			}
			setFeedback({ isOpen: true, type: "success", title: "Project Deleted", message: "Project deleted successfully." });

			onClose();
		} finally {
			setIsArchiving(false);
		}
	};

	if (
		!organizationSlug ||
		!workspaceSlug ||
		!projectSlug
	) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
			<div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
				<div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
					<h2 className="text-lg font-semibold text-gray-900">
						Project Settings
					</h2>

					<button
						type="button"
						onClick={onClose}
						disabled={
							isProjectLoading ||
							isArchiving
						}
						className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<X size={22} />
					</button>
				</div>

				<form
					onSubmit={handleSubmit(handleUpdate)}
					className="px-6 py-6"
				>
					<div className="space-y-5">
						<Input
							id="project-name"
							label="Project Name"
							error={errors.name?.message}
							{...register("name", {
								required:
									"Project name is required.",
								minLength: {
									value: 2,
									message:
										"Project name must be at least 2 characters.",
								},
								maxLength: {
									value: 50,
									message:
										"Project name cannot exceed 50 characters.",
								},
							})}
						/>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="project-description"
								className="text-sm font-medium text-gray-700"
							>
								Description
							</label>

							<textarea
								id="project-description"
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
									{
										errors.description
											.message
									}
								</p>
							)}
						</div>
					</div>

					{/* Message */}
					{message && (
						<p
							className={`mt-4 text-sm ${message.type === "success"
								? "text-green-600"
								: "text-red-500"
								}`}
						>
							{message.text}
						</p>
					)}

					<div className="mt-6 flex items-center justify-end gap-3">
						<Button
							type="button"
							variant="outline_light"
							onClick={onClose}
							disabled={
								isProjectLoading ||
								isArchiving
							}
							className="w-auto rounded-lg px-5 text-sm font-medium text-gray-600 hover:bg-gray-100"
						>
							Cancel
						</Button>

						<Button
							type="submit"
							disabled={
								isProjectLoading ||
								isArchiving ||
								!isDirty
							}
							className="w-auto rounded-lg bg-orange-500 px-5 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isProjectLoading
								? "Saving..."
								: "Save Changes"}
						</Button>

						<Button
							type="button"
							onClick={handleArchive}
							disabled={
								isProjectLoading ||
								isArchiving
							}
							className="w-auto rounded-lg bg-orange-500 px-5 text-sm font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isArchiving
								? "Deleting..."
								: "Delete Project"}
						</Button>
					</div>
				</form>
			</div>
			<FeedbackModal {...feedback} onClose={() => setFeedback((current) => ({ ...current, isOpen: false }))} />
		</div>
	);
};

export default ProjectSettings;
