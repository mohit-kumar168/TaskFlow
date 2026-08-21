import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import {
	useIssueStore,
} from "@/store/issue.store";

type CreateIssueFormData = {
	title: string;
	description: string;
	type: "TASK" | "BUG" | "STORY" | "EPIC";
	priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
	email: string;
	dueDate: string;
};

interface CreateIssueModalProps {
	isOpen: boolean;
	organizationSlug: string;
	workspaceSlug: string;
	projectSlug: string;
	onClose: () => void;
	onCreated?: () => void;
}

const CreateIssueModal = ({
	isOpen,
	organizationSlug,
	workspaceSlug,
	projectSlug,
	onClose,
	onCreated,
}: CreateIssueModalProps) => {
	const { createIssue, isCreating } = useIssueStore();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<CreateIssueFormData>({
		defaultValues: {
			title: "",
			description: "",
			type: "TASK",
			priority: "MEDIUM",
			email: "",
			dueDate: "",
		},
	});

	if (!isOpen) {
		return null;
	}

	const handleCreateIssue = async (
		data: CreateIssueFormData,
	) => {
		const issue = await createIssue(
			organizationSlug,
			workspaceSlug,
			projectSlug,
			{
				title: data.title.trim(),
				description: data.description.trim() || undefined,
				type: data.type,
				priority: data.priority,
				email: data.email.trim() || undefined,
				dueDate: data.dueDate
					? new Date(`${data.dueDate}T00:00:00.000Z`).toISOString()
					: undefined,
			},
		);

		if (!issue) {
			return;
		}

		reset();
		onClose();
		onCreated?.();
	};

	const handleClose = () => {
		if (isCreating) {
			return;
		}

		reset();
		onClose();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
				<div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
					<h2 className="text-lg font-semibold text-gray-900">
						Create Issue
					</h2>

					<button
						type="button"
						onClick={handleClose}
						disabled={isCreating}
						className="rounded-lg px-2 py-1 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					>
						×
					</button>
				</div>

				<form
					onSubmit={handleSubmit(handleCreateIssue)}
					className="space-y-5 px-6 py-6"
				>
					<Input
						id="title"
						label="Title"
						placeholder="Enter issue title"
						error={errors.title?.message}
						{...register("title", {
							required: "Issue title is required.",
							minLength: {
								value: 2,
								message:
									"Issue title must be at least 2 characters.",
							},
							maxLength: {
								value: 100,
								message:
									"Issue title cannot exceed 100 characters.",
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
							placeholder="Describe the issue..."
							{...register("description", {
								maxLength: {
									value: 500,
									message:
										"Description cannot exceed 500 characters.",
								},
							})}
							className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
						/>

						{errors.description && (
							<p className="text-sm text-red-500">
								{errors.description.message}
							</p>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex flex-col gap-2">
							<label
								htmlFor="type"
								className="text-sm font-medium text-gray-700"
							>
								Type
							</label>

							<select
								id="type"
								{...register("type")}
								className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
							>
								<option value="TASK">Task</option>
								<option value="BUG">Bug</option>
								<option value="STORY">Story</option>
								<option value="EPIC">Epic</option>
							</select>
						</div>

						<div className="flex flex-col gap-2">
							<label
								htmlFor="priority"
								className="text-sm font-medium text-gray-700"
							>
								Priority
							</label>

							<select
								id="priority"
								{...register("priority")}
								className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
							>
								<option value="LOW">Low</option>
								<option value="MEDIUM">Medium</option>
								<option value="HIGH">High</option>
								<option value="URGENT">Urgent</option>
							</select>
						</div>
					</div>

					<Input
						id="email"
						label="Assignee Email"
						type="email"
						placeholder="Enter assignee email (optional)"
						error={errors.email?.message}
						{...register("email", {
							pattern: {
								value:
									/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Enter a valid email address.",
							},
						})}
					/>

					<Input
						id="dueDate"
						label="Due Date"
						type="date"
						error={errors.dueDate?.message}
						{...register("dueDate")}
					/>

					<div className="flex justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="outline_light"
							onClick={handleClose}
							disabled={isCreating}
							className="md:w-1/2 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Cancel
						</Button>

						<Button
							type="submit"
							disabled={isCreating}
							className="md:w-1/2"
						>
							{isCreating
								? "Creating..."
								: "Create Issue"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CreateIssueModal;
