import { useState } from "react";
import { useParams } from "react-router-dom";
import { MoreVertical } from "lucide-react";

import { type WorkspaceMemberProps } from "@/api/workspace.api";
import { useWorkspaceStore } from "@/store/workspace.store";
import ChangeWorkspaceMemberRoleModal from "./ChangeWorkspaceMemberRoleModal";


const MemberTable = ({
	members,
}: {
	members: WorkspaceMemberProps[];
}) => {
	const { organizationSlug, workspaceSlug } = useParams<{
		organizationSlug: string;
		workspaceSlug: string;
	}>();

	const {
		updateWorkspaceMemberRole,
		removeWorkspaceMember,
	} = useWorkspaceStore();

	const [openMenuId, setOpenMenuId] = useState<string | null>(null);

	const [selectedMember, setSelectedMember] =
		useState<WorkspaceMemberProps | null>(null);

	const [isRoleModalOpen, setIsRoleModalOpen] =
		useState(false);

	const [isUpdatingRole, setIsUpdatingRole] =
		useState(false);

	const handleRemoveMember = async (memberId: string) => {
		if (!organizationSlug || !workspaceSlug) {
			return;
		}

		const confirmed = window.confirm(
			"Are you sure you want to remove this member?",
		);

		if (!confirmed) {
			return;
		}

		try {
			await removeWorkspaceMember(
				organizationSlug,
				workspaceSlug,
				memberId,
			);
		} catch (error) {
			console.error(
				"Failed to remove workspace member:",
				error,
			);
		}
	};

	const handleChangeRole = async (
		role: "ADMIN" | "MEMBER",
	) => {
		if (
			!organizationSlug ||
			!workspaceSlug ||
			!selectedMember
		) {
			return;
		}

		try {
			setIsUpdatingRole(true);

			await updateWorkspaceMemberRole(
				organizationSlug,
				workspaceSlug,
				selectedMember.id,
				role,
			);

			setIsRoleModalOpen(false);
			setSelectedMember(null);
		} catch (error) {
			console.error(
				"Failed to update workspace member role:",
				error,
			);
		} finally {
			setIsUpdatingRole(false);
		}
	};

	return (
		<>
			<div className="rounded-xl border border-gray-200 bg-white shadow-sm">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-4 text-left text-sm font-semibold">
								Member
							</th>

							<th className="px-6 py-4 text-left text-sm font-semibold">
								Role
							</th>

							<th className="px-6 py-4 text-left text-sm font-semibold">
								Joined
							</th>

							<th />
						</tr>
					</thead>

					<tbody>
						{members.map((member) => (
							<tr
								key={member.user.email}
								className="border-t border-gray-200"
							>
								<td className="px-6 py-4">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-500">
											{member.user.name.charAt(0)}
										</div>

										<div>
											<p className="font-medium">
												{member.user.name}
											</p>

											<p className="text-sm text-gray-500">
												{member.user.email}
											</p>
										</div>
									</div>
								</td>

								<td className="px-6 py-4">
									<span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
										{member.role}
									</span>
								</td>

								<td className="px-6 py-4 text-gray-500">
									{new Date(
										member.joinedAt,
									).toLocaleDateString()}
								</td>

								<td className="px-6 py-4 text-right">
									{member.role !== "OWNER" && (
										<div className="relative inline-block">
											<button
												type="button"
												onClick={() =>
													setOpenMenuId((current) =>
														current === member.id
															? null
															: member.id,
													)
												}
												className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
											>
												<MoreVertical size={18} />
											</button>

											{openMenuId === member.id && (
												<div className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-left shadow-lg">
													<button
														type="button"
														onClick={() => {
															setSelectedMember(member);
															setIsRoleModalOpen(true);
															setOpenMenuId(null);
														}}
														className="flex w-full items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
													>
														Change role
													</button>

													<button
														type="button"
														onClick={() => {
															handleRemoveMember(
																member.id,
															);
															setOpenMenuId(null);
														}}
														className="flex w-full items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
													>
														Remove member
													</button>
												</div>
											)}
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<ChangeWorkspaceMemberRoleModal
				isOpen={isRoleModalOpen}
				member={selectedMember}
				isSubmitting={isUpdatingRole}
				onClose={() => {
					setIsRoleModalOpen(false);
					setSelectedMember(null);
				}}
				onSubmit={handleChangeRole}
			/>
		</>
	);
};

export default MemberTable;
