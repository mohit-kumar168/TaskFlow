import { createWorkspace } from "@/api/workspace.api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface CreateWorkspaceForm {
	name: string;
	description: string;
}

const CreateWorkspace = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CreateWorkspaceForm>();

	const onSubmit = async (data: CreateWorkspaceForm) => {
		try {
			setIsSubmitting(true);
			const response = await createWorkspace(data);
			navigate(`/workspaces/${response.data.data.workspace.id}`);

		} catch (error) {
			console.log(error)
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="mx-auto max-w-3xl overflow-y-auto py-8">
			<button
				type="button"
				onClick={() => navigate(-1)}
				className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500"
			>
				<ArrowLeft size={18} />
				Back
			</button>

			<div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
				<div className="border-b border-gray-200 pb-6">
					<h1 className="text-3xl font-bold text-gray-800">
						Create Workspace
					</h1>

					<p className="mt-2 text-sm text-gray-500">
						Create a workspace to organize your projects and collaborate
						with your team.
					</p>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="mt-8 space-y-6"
				>
					<Input
						label="Workspace Name"
						id="name"
						type="text"
						placeholder="TaskFlow Workspace"
						error={errors.name?.message}
						{...register("name", {
							required: "Workspace name is required",
							minLength: {
								value: 3,
								message: "Workspace name must be at least 3 characters",
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
							rows={5}
							placeholder="Describe your workspace..."
							className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
							{...register("description")}
						/>

						{errors.description && (
							<p className="text-sm text-red-500">
								{errors.description.message}
							</p>
						)}
					</div>

					<div className="flex justify-end gap-4 pt-2">
						<Button
							type="button"
							variant="outline_light"
							onClick={() => navigate("/dashboard")}
						>
							Cancel
						</Button>

						<Button
							type="submit"
							className={`w-auto px-6 ${isSubmitting ? "cursor-not-allowed" : "cursor-pointer"}`}
						>
							{isSubmitting ? "Submitting..." : "Create Workspace"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateWorkspace;
