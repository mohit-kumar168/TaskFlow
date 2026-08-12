import { ArrowLeft, FolderKanban, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useProjectStore } from "@/store/project.store";

interface CreateProjectForm {
	name: string;
	key: string;
	description: string;
	iconUrl: string;
	boardName: string;
}

const CreateProject = () => {
	const navigate = useNavigate();

	const { organizationSlug, workspaceSlug } = useParams<{
		organizationSlug: string;
		workspaceSlug: string;
	}>();

	const { createProject, isLoading } = useProjectStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateProjectForm>({
		defaultValues: {
			name: "",
			key: "",
			description: "",
			iconUrl: "",
			boardName: "",
		},
	});

	const onSubmit = async (data: CreateProjectForm) => {
		if (!organizationSlug || !workspaceSlug) {
			return;
		}

		const project = await createProject(
			organizationSlug,
			workspaceSlug,
			{
				name: data.name.trim(),
				key: data.key.trim().toUpperCase(),
				description: data.description.trim() || undefined,
				iconUrl: data.iconUrl.trim() || undefined,
				boardName: data.boardName.trim(),
			},
		);
		console.log("Created project:", project);

		if (!project) {
			return;
		}

		navigate(
			`/organizations/${organizationSlug}/workspaces/${workspaceSlug}/projects/${project.slug}`,
		);
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
						Create Project
					</h1>

					<p className="mt-2 text-sm text-gray-500">
						Create a project inside this workspace.
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="space-y-5"
				>
					<Input
						id="name"
						label="Project Name"
						placeholder="e.g. TaskFlow"
						maxLength={20}
						{...register("name", {
							required: "Project name is required.",
							maxLength: {
								value: 20,
								message:
									"Project name cannot exceed 20 characters.",
							},
						})}
						error={errors.name?.message}
					/>

					<Input
						id="key"
						label="Project Key"
						placeholder="e.g. TF"
						maxLength={10}
						{...register("key", {
							required: "Project key is required.",
							maxLength: {
								value: 10,
								message:
									"Project key cannot exceed 10 characters.",
							},
						})}
						error={errors.key?.message}
					/>

					<Input
						id="boardName"
						label="Board Name"
						placeholder="e.g. Task Board"
						maxLength={20}
						{...register("boardName", {
							required: "Board name is required.",
							maxLength: {
								value: 20,
								message:
									"Board name cannot exceed 20 characters.",
							},
						})}
						error={errors.boardName?.message}
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
							placeholder="Describe your project"
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
						id="iconUrl"
						label="Icon URL"
						type="url"
						placeholder="https://example.com/icon.png"
						{...register("iconUrl", {
							pattern: {
								value:
									/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
								message: "Enter a valid URL.",
							},
						})}
						error={errors.iconUrl?.message}
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
								: "Create Project"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateProject;