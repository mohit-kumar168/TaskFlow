type WorkspacePageSkeletonProps = {
	variant?: "page" | "header";
};

const line = "rounded-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse";

const WorkspacePageSkeleton = ({ variant = "page" }: WorkspacePageSkeletonProps) => {
	if (variant === "header") {
		return (
			<header className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
					<div className="space-y-3">
						<div className={`${line} h-4 w-24`} />
						<div className={`${line} h-10 w-72 max-w-full`} />
						<div className={`${line} h-4 w-[min(32rem,100%)]`} />
					</div>

					<div className="flex items-center gap-2">
						<div className={`${line} h-10 w-10`} />
						<div className={`${line} h-10 w-10`} />
					</div>
				</div>

				<div className="mt-6 flex flex-wrap gap-6 border-y border-gray-200 py-4">
					<div className={`${line} h-5 w-32`} />
					<div className={`${line} h-5 w-32`} />
				</div>

				<div className="mt-4 flex gap-6">
					<div className={`${line} h-7 w-24`} />
					<div className={`${line} h-7 w-20`} />
					<div className={`${line} h-7 w-20`} />
				</div>
			</header>
		);
	}

	return (
		<div className="space-y-6">
			<section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div className="space-y-3">
						<div className={`${line} h-4 w-28`} />
						<div className={`${line} h-8 w-80 max-w-full`} />
					</div>
					<div className="flex gap-3">
						<div className={`${line} h-10 w-28`} />
						<div className={`${line} h-10 w-36`} />
					</div>
				</div>
			</section>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{Array.from({ length: 6 }).map((_, index) => (
					<article key={index} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
						<div className="flex items-start justify-between gap-4">
							<div className="space-y-3">
								<div className={`${line} h-3 w-20`} />
								<div className={`${line} h-6 w-44 max-w-full`} />
							</div>
							<div className={`${line} h-10 w-10 rounded-xl`} />
						</div>

						<div className="mt-5 space-y-3">
							<div className={`${line} h-3 w-full`} />
							<div className={`${line} h-3 w-5/6`} />
						</div>

						<div className="mt-6 flex items-center justify-between">
							<div className={`${line} h-4 w-24`} />
							<div className={`${line} h-4 w-16`} />
						</div>
					</article>
				))}
			</section>
		</div>
	);
};

export default WorkspacePageSkeleton;
