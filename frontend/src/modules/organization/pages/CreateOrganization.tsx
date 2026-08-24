import { ArrowLeft, Building2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useOrganizationStore } from "@/store/organization.store";
import FeedbackModal from "@/components/ui/FeedBackModal";
import { useState } from "react";

interface CreateOrganizationForm {
	name: string;
	description: string;
	logoUrl: string;
}

const CreateOrganization = () => {
	const navigate = useNavigate();
	const [feedback, setFeedback] = useState<{ isOpen: boolean; type: "success" | "error"; title: string; message: string }>({ isOpen: false, type: "success", title: "", message: "" });

	const { createOrganization, isLoading } =
		useOrganizationStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateOrganizationForm>({
		defaultValues: {
			name: "",
			description: "",
			logoUrl: "",
		},
	});

	const onSubmit = async (data: CreateOrganizationForm) => {
		const organization = await createOrganization({
			name: data.name.trim(),
			description: data.description.trim() || undefined,
			logoUrl: data.logoUrl.trim() || undefined,
		});

		if (!organization) {
			setFeedback({ isOpen: true, type: "error", title: "Organization Creation Failed", message: "Unable to create the organization. Please try again." });
			return;
		}

		setFeedback({ isOpen: true, type: "success", title: "Organization Created", message: "Your organization was created successfully." });
	};

	return (
		<div className="flex min-h-full items-center justify-center p-4 sm:p-6">
			<div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
				<button
					type="button"
					onClick={() => navigate(-1)}
					className="mb-6 flex items-center gap-2 text-sm text-gray-500 transition hover:text-orange-500"
				>
					<ArrowLeft size={17} />
					Back
				</button>

				<div className="mb-8">
					<h1 className="text-2xl font-semibold text-gray-900">
						Create Organization
					</h1>

					<p className="mt-2 text-sm text-gray-500">
						Create an organization to manage your workspaces
						and projects.
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-5"
				>
					<Input
						id="name"
						label="Organization Name"
						placeholder="e.g. TaskFlow Team"
						maxLength={20}
						{...register("name", {
							required: "Organization name is required.",
							maxLength: {
								value: 20,
								message:
									"Organization name cannot exceed 20 characters.",
							},
						})}
						error={errors.name?.message}
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
							placeholder="What is this organization about?"
							rows={4}
							maxLength={500}
							className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
							{...register("description", {
								maxLength: {
									value: 500,
									message:
										"Description cannot exceed 500 characters.",
								},
							})}
						/>

						{errors.description && (
							<p className="text-sm text-red-500">
								{errors.description.message}
							</p>
						)}
					</div>

					<Input
						id="logoUrl"
						label="Logo URL"
						type="url"
						placeholder="https://example.com/logo.png"
						{...register("logoUrl", {
							pattern: {
								value:
									/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
								message: "Enter a valid URL.",
							},
						})}
						error={errors.logoUrl?.message}
					/>

					<div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
						<Button
							type="button"
							variant="outline_light"
							onClick={() => navigate(-1)}
							className="w-full sm:w-auto"
						>
							Cancel
						</Button>

						<Button
							type="submit"
							disabled={isLoading}
							className="flex w-full items-center justify-center gap-2 sm:w-auto"
						>
							{isLoading && (
								<Loader2
									size={17}
									className="animate-spin"
								/>
							)}

							{isLoading
								? "Creating..."
								: "Create Organization"}
						</Button>
					</div>
				</form>
			</div>
				<FeedbackModal {...feedback} onClose={() => { setFeedback((current) => ({ ...current, isOpen: false })); if (feedback.type === "success") navigate("/dashboard"); }} />
		</div>
	);
};

export default CreateOrganization;