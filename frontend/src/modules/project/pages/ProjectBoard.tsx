import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useParams } from "react-router-dom";

import { useProjectStore } from "@/store/project.store";

const ProjectBoard = () => {
	const { organizationSlug, workspaceSlug, projectSlug } = useParams<{
		organizationSlug: string;
		workspaceSlug: string;
		projectSlug: string;
	}>();

	const {
		currentBoard,
		boardColumns,
		isBoardLoading,
		fetchBoard,
		fetchBoardColumns,
		clearBoard,
	} = useProjectStore();

	useEffect(() => {
		if (!organizationSlug || !workspaceSlug || !projectSlug) {
			return;
		}

		fetchBoard(organizationSlug, workspaceSlug, projectSlug);

		fetchBoardColumns(organizationSlug, workspaceSlug, projectSlug);
	}, [
		organizationSlug,
		workspaceSlug,
		projectSlug,
		clearBoard,
		fetchBoard,
		fetchBoardColumns,
	]);

	if (isBoardLoading && !currentBoard) {
		return (
			<div className="flex min-h-100 items-center justify-center">
				<p className="text-sm text-gray-500">Loading board...</p>
			</div>
		);
	}

	if (!currentBoard) {
		return (
			<div className="p-6">
				<div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
					<p className="text-sm text-gray-500">Board not found.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="mb-5 flex items-center justify-between">
				<div>
					<h2 className="text-base font-semibold text-gray-900">
						{currentBoard.name}
					</h2>

					<p className="mt-1 text-sm text-gray-500">
						Manage your project work from this board.
					</p>
				</div>

				<button
					type="button"
					className="flex items-center gap-2 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
				>
					<Plus size={16} />
					Add column
				</button>
			</div>

			<div className="flex min-h-125 gap-4 overflow-x-auto pb-4">
				{boardColumns.map((column) => (
					<div
						key={column.id}
						className="w-70 min-w-70 rounded-xl border border-gray-200 bg-gray-100"
					>
						<div className="flex items-center justify-between px-4 py-3">
							<div className="flex min-w-0 items-center gap-2">
								<div
									className="h-2.5 w-2.5 shrink-0 rounded-full"
									style={{
										backgroundColor: column.color || "#9ca3af",
									}}
								/>

								<h3 className="truncate text-sm font-semibold text-gray-700">
									{column.name}
								</h3>
							</div>

							<span className="rounded-md bg-white px-2 py-0.5 text-xs text-gray-500">
								0
							</span>
						</div>

						<div className="min-h-100 px-3 pb-3">
							<div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/50">
								<p className="text-xs text-gray-400">No issues yet</p>
							</div>
						</div>
					</div>
				))}

				{boardColumns.length === 0 && (
					<div className="flex min-h-100 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white">
						<div className="text-center">
							<h3 className="text-sm font-medium text-gray-700">
								No columns yet
							</h3>

							<p className="mt-1 text-xs text-gray-400">
								Create a column to start building your board.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProjectBoard;
