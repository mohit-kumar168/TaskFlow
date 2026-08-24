import DropdownMenu from "@/components/ui/DropdownMenu";

export interface CommonMemberProps {
	id: string;
	name: string;
	email: string;
	role: string;
	joinedAt: string;
	status?: string;
}

interface MemberTableProps {
	members: CommonMemberProps[];
	onChangeRole: (member: CommonMemberProps) => void;
	onRemove: (member: CommonMemberProps) => void;
	showStatus?: boolean;
	canManage?: (member: CommonMemberProps) => boolean;
}

const MemberTable = ({
	members,
	onChangeRole,
	onRemove,
	showStatus = false,
	canManage = () => true,
}: MemberTableProps) => {
	const getInitial = (name: string) => {
		return name?.charAt(0).toUpperCase() || "?";
	};

	const formatDate = (date: string) => {
		if (!date) {
			return "—";
		}

		return new Date(date).toLocaleDateString();
	};

	return (
		<div className="rounded-xl border border-gray-200 bg-white">
			<div className="">
				<table className="w-full">
					<thead className="border-b border-gray-200 bg-gray-50">
						<tr>
							<th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
								Member
							</th>

							<th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
								Role
							</th>

							{showStatus && (
								<th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
									Status
								</th>
							)}

							<th className="px-5 py-3 text-left text-xs font-medium text-gray-500">
								Joined
							</th>

							<th className="w-16 px-5 py-3" />
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-100">
						{members.map((member) => (
							<tr
								key={member.id}
								className="transition hover:bg-gray-50"
							>
								<td className="px-5 py-4">
									<div className="flex items-center gap-3">
										<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-600">
											{getInitial(member.name)}
										</div>

										<div className="min-w-0">
											<p className="truncate text-sm font-medium text-gray-900">
												{member.name}
											</p>

											<p className="truncate text-xs text-gray-500">
												{member.email}
											</p>
										</div>
									</div>
								</td>

								<td className="px-5 py-4">
									<span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
										{member.role}
									</span>
								</td>

								{showStatus && (
									<td className="px-5 py-4 text-sm text-gray-500">
										{member.status ?? "-"}
									</td>
								)}

								<td className="px-5 py-4 text-sm text-gray-500">
									{formatDate(member.joinedAt)}
								</td>

								<td className="px-5 py-4">
									{canManage(member) && <DropdownMenu
										items={[
											{
												label: "Change Role",
												onClick: () =>
													onChangeRole(
														member,
													),
												danger: false,
											},
											{
												label: "Remove Member",
												onClick: () =>
													onRemove(
														member,
													),
												danger: true,
											},
										]}
									/>}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{members.length === 0 && (
				<div className="px-6 py-10 text-center">
					<p className="text-sm text-gray-500">
						No members found.
					</p>
				</div>
			)}
		</div>
	);
};

export default MemberTable;
