import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import { useOrganizationStore } from "@/store/organization.store";
import { useNavigate } from "react-router-dom";
import FeedbackModal from "@/components/ui/FeedBackModal";

type OrganizationFormData = {
	name: string;
	description?: string;
};

const OrganizationGeneralSettings = () => {
	const {
		currentOrganization,
		updateOrganization,
		archiveOrganization,
		isLoading,
	} = useOrganizationStore();

	const [isEditing, setIsEditing] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const navigate = useNavigate();

	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const [feedback, setFeedback] = useState({ isOpen: false, type: "success" as "success" | "error", title: "", message: "", shouldNavigate: false });

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isDirty },
	} = useForm<OrganizationFormData>({
		defaultValues: {
			name: currentOrganization?.name ?? "",
			description:
				currentOrganization?.description ?? "",
		},
	});

	useEffect(() => {
		reset({
			name: currentOrganization?.name ?? "",
			description:
				currentOrganization?.description ?? "",
		});
	}, [currentOrganization, reset]);

	const handleUpdate = async (
		data: OrganizationFormData,
	) => {
		if (!currentOrganization) {
			return;
		}

		setMessage(null);

		const updatedOrganization =
			await updateOrganization(
				currentOrganization.slug,
				{
					name: data.name.trim(),
					description:
						data.description?.trim() ?? "",
				},
			);

		if (!updatedOrganization) {
			setFeedback({ isOpen: true, type: "error", title: "Update Failed", message: "Unable to update the organization.", shouldNavigate: false });
			setMessage({
				type: "error",
				text: "Failed to update organization.",
			});

			return;
		}

		setIsEditing(false);

		setMessage({
			type: "success",
			text: "Organization updated successfully.",
		});
		setFeedback({ isOpen: true, type: "success", title: "Organization Updated", message: "Organization updated successfully.", shouldNavigate: false });
	};

	const handleCancelEdit = () => {
		reset({
			name: currentOrganization?.name ?? "",
			description:
				currentOrganization?.description ?? "",
		});

		setIsEditing(false);
		setMessage(null);
	};

	const handleDeleteOrganization = async () => {
		if (!currentOrganization) {
			return;
		}

		const organizationName = currentOrganization.name;

		const confirmed = window.confirm(`Are you sure you want to delete "${organizationName}"?`);
		if (!confirmed) {
			return;
		}

		try {
			setIsDeleting(true);
			setMessage(null);

			const deleted = await archiveOrganization(currentOrganization.slug);

			if (!deleted) {
				setFeedback({ isOpen: true, type: "error", title: "Deletion Failed", message: "Unable to delete the organization.", shouldNavigate: false });
				setMessage({
					type: "error",
					text: "Failed to delete organization."
				});

				return;
			}
			setFeedback({ isOpen: true, type: "success", title: "Organization Deleted", message: "Organization deleted successfully.", shouldNavigate: true });
		} finally {
			setIsDeleting(false);
		}
	};

	if (!currentOrganization) {
		return (
			<div className="text-sm text-gray-500">
				No organization selected.
			</div>
		);
	}

	return (
		<div className="max-w-3xl">
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-base font-semibold text-gray-900">
						Organization
					</h3>

					<p className="mt-1 text-sm text-gray-500">
						Manage your organization's basic information.
					</p>
				</div>

				{!isEditing && (
					<button
						type="button"
						onClick={() => {
							setIsEditing(true);
							setMessage(null);
						}}
						className="text-sm font-medium text-orange-500 hover:text-orange-600 p-2 rounded-full hover:bg-gray-100"
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
							label="Organization Name"
							error={errors.name?.message}
							{...register("name", {
								required:
									"Organization name is required.",
								minLength: {
									value: 2,
									message:
										"Organization name must be at least 2 characters.",
								},
								maxLength: {
									value: 20,
									message:
										"Organization name cannot exceed 20 characters.",
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
								{isLoading
									? "Saving..."
									: "Save Changes"}
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
								Organization Name
							</p>

							<p className="mt-1 text-sm text-gray-900">
								{currentOrganization.name}
							</p>
						</div>

						<div>
							<p className="text-xs font-medium text-gray-500">
								Description
							</p>

							<p className="mt-1 text-sm text-gray-900">
								{currentOrganization.description ||
									"No description provided."}
							</p>
						</div>
					</div>
				)}
			</div>

			<div className="flex items-center justify-center mt-32 border-t border-gray-200 pt-8">
				<div className="w-1/2">
					<Button
						type="button"
						variant="primary"
						onClick={handleDeleteOrganization}
						disabled={isDeleting || isLoading}
					>
						{isDeleting
							? "Deleting..."
							: "Delete Organization"
						}
					</Button>
				</div>
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
			<FeedbackModal {...feedback} onClose={() => { setFeedback((current) => ({ ...current, isOpen: false })); if (feedback.shouldNavigate) navigate("/dashboard"); }} />
		</div>
	);
};

export default OrganizationGeneralSettings;
