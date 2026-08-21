import type { IssueProps } from "@/api/issue.api";

interface IssueCardProps {
	issue: IssueProps;
	onClick?: () => void;
}

const IssueCard = ({
	issue,
	onClick,
}: IssueCardProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full rounded-lg border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-gray-300 hover:shadow"
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0">
					<p className="text-xs font-medium text-gray-400">
						{issue.issueKey}
					</p>

					<h4 className="mt-1 text-sm font-semibold text-gray-800">
						{issue.title}
					</h4>
				</div>
			</div>

			<div className="mt-3 flex flex-wrap items-center gap-2">
				<span className="rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-600">
					{issue.type}
				</span>

				<span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
					{issue.priority}
				</span>
			</div>
		</button>
	);
};

export default IssueCard;
