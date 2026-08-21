import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import {
	type IssueProps,
	type IssueType,
	type IssuePriority,
	type UpdateIssueProps,
} from "@/api/issue.api";

interface IssueDetailsFormData {
	title: string;
	description: string;
	type: IssueType;
	priority: IssuePriority;
	dueDate: string;
	email: string;
}

interface IssueDetailsModalProps {
	isOpen: boolean;
	issue: IssueProps | null;
	isSubmitting: boolean;
	isArchiving: boolean;
	onClose: () => void;
	onSubmit: (data: UpdateIssueProps) => void;
	onRemove: () => void;
}

const IssueDetailsModal = ({
	isOpen,
	issue,
	isSubmitting,
	isArchiving,
	onClose,
	onSubmit,
	onRemove,
}: IssueDetailsModalProps) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<IssueDetailsFormData>({
		defaultValues: {
			title: "",
			description: "",
			type: "TASK",
			priority: "MEDIUM",
			dueDate: "",
			email: "",
		},
	});

	useEffect(() => {
		if (!issue) {
			return;
		}

		reset({
			title: issue.title,
			description: issue.description ?? "",
			type: issue.type,
			priority: issue.priority,
			dueDate: issue.dueDate
				? issue.dueDate.split("T")[0]
				: "",
			email: "",
		});
	}, [issue, reset]);

	if (!isOpen || !issue) {
		return null;
	}

	const handleFormSubmit = (
		data: IssueDetailsFormData,
	) => {
		onSubmit({
			title: data.title.trim(),
			description: data.description.trim(),
			type: data.type,
			priority: data.priority,
			dueDate: data.dueDate || undefined,
			email: data.email.trim() || undefined,
		});
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
			<div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
				<div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
					<div>
						<p className="text-xs font-medium text-gray-400">
							{issue.issueKey}
						</p>

						<h2 className="mt-1 text-lg font-semibold text-gray-900">
							Edit Issue
						</h2>
					</div>

					<button
						type="button"
						onClick={onClose}
						disabled={isSubmitting}
						className="rounded-lg px-2 py-1 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					>
						×
					</button>
				</div>

				<form
					onSubmit={handleSubmit(handleFormSubmit)}
					className="space-y-5 p-6"
				>
					<Input
						id="title"
						label="Title"
						error={errors.title?.message}
						{...register("title", {
							required: "Issue title is required.",
							minLength: {
								value: 2,
								message:
									"Issue title must be at least 2 characters.",
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
							{...register("description")}
							className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
							placeholder="Describe the issue..."
						/>
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
								disabled={isSubmitting}
								className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
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
								disabled={isSubmitting}
								className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
							>
								<option value="LOW">Low</option>
								<option value="MEDIUM">Medium</option>
								<option value="HIGH">High</option>
								<option value="URGENT">Urgent</option>
							</select>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						<label
							htmlFor="dueDate"
							className="text-sm font-medium text-gray-700"
						>
							Due Date
						</label>

						<input
							id="dueDate"
							type="date"
							{...register("dueDate")}
							disabled={isSubmitting}
							className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
						/>
					</div>

					<Input
						id="email"
						type="email"
						label="Assignee Email"
						placeholder="member@example.com"
						error={errors.email?.message}
						{...register("email")}
					/>

					<div className="flex justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="outline_light"
							onClick={onRemove}
							disabled={isSubmitting || isArchiving}
							className="md:w-1/3 rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isArchiving ? "Removing..." : "Remove Issue"}
						</Button>
						<Button
							type="button"
							variant="outline_light"
							onClick={onClose}
							disabled={isSubmitting}
							className="md:w-1/3 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
						>
							Cancel
						</Button>

						<Button
							type="submit"
							disabled={isSubmitting}
							className="md:w-1/3"
						>
							{isSubmitting
								? "Saving..."
								: "Save Changes"}
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default IssueDetailsModal;
