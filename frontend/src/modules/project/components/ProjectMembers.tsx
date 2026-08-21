import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useProjectStore } from "@/store/project.store";
import type { ProjectMemberProps } from "@/api/project.api";
import { MoreVertical } from "lucide-react";
import ChangeProjectMemberRoleModal from "./ChangeProjectMemberRoleModal";
import AddProjectMemberModal from "./AddProjectMemberModal";

const ProjectMembers = () => {
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [selectedMember, setSelectedMember] = useState<ProjectMemberProps | null>(null);
	const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
	const [isUpdatingRole, setIsUpdatingRole] = useState(false);
	const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
	const [isAddingMember, setIsAddingMember] = useState(false);

	const {
		organizationSlug,
		workspaceSlug,
		projectSlug,
	} = useParams<{
		organizationSlug: string;
		workspaceSlug: string;
		projectSlug: string;
	}>();

	const {
		projectMembers,
		isProjectMembersLoading,
		fetchProjectMembers,
		addProjectMember,
		updateProjectMemberRole,
		removeProjectMember,
	} = useProjectStore();

	useEffect(() => {
		if (
			!organizationSlug ||
			!workspaceSlug ||
			!projectSlug
		) {
			return;
		}

		fetchProjectMembers(
			organizationSlug,
			workspaceSlug,
			projectSlug,
		);
	}, [
		organizationSlug,
		workspaceSlug,
		projectSlug,
		fetchProjectMembers,
	]);

	const handleAddMember = async (data: {
		email: string;
		role: "ADMIN" | "MEMBER";
	}) => {
		if (
			!organizationSlug ||
			!workspaceSlug ||
			!projectSlug
		) {
			return;
		}

		try {
			setIsAddingMember(true);

			const success = await addProjectMember(
				organizationSlug,
				workspaceSlug,
				projectSlug,
				data,
			);

			if (success) {
				setIsAddMemberOpen(false);
			}
		} catch (error) {
			console.error(
				"Failed to add project member:",
				error,
			);
		} finally {
			setIsAddingMember(false);
		}
	};

	const handleChangeRole = async (
		role: "ADMIN" | "MEMBER",
	) => {
		if (
			!organizationSlug ||
			!workspaceSlug ||
			!projectSlug ||
			!selectedMember
		) {
			return;
		}

		try {
			setIsUpdatingRole(true);

			const updatedMember =
				await updateProjectMemberRole(
					organizationSlug,
					workspaceSlug,
					projectSlug,
					selectedMember.id,
					role,
				);

			if (!updatedMember) {
				return;
			}

			setIsRoleModalOpen(false);
			setSelectedMember(null);
		} finally {
			setIsUpdatingRole(false);
		}
	};

	const handleRemoveMember = async (
		member: ProjectMemberProps,
	) => {
		if (
			!organizationSlug ||
			!workspaceSlug ||
			!projectSlug
		) {
			return;
		}

		const confirmed = window.confirm(
			`Remove ${member.user.name} from this project?`,
		);

		if (!confirmed) {
			return;
		}

		setOpenMenuId(null);

		await removeProjectMember(
			organizationSlug,
			workspaceSlug,
			projectSlug,
			member.id,
		);
	};

	if (isProjectMembersLoading) {
		return (
			<div className="p-6 text-center text-sm text-gray-500">
				Loading project members...
			</div>
		);
	}

	return (
		<div className="p-6">
			<div className="mb-5 flex items-center justify-between">
				<h2 className="text-base font-semibold text-gray-900">
					Project Members
				</h2>

				<button
					type="button"
					onClick={() => setIsAddMemberOpen(true)}
					className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
				>
					Add member
				</button>
			</div>

			<div className="rounded-xl border border-gray-200 bg-white shadow-sm">
				<table className="w-full">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
								Member
							</th>

							<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
								Role
							</th>

							<th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
								Joined
							</th>

							<th />
						</tr>
					</thead>

					<tbody>
						{projectMembers.map((member) => (
							<tr
								key={member.id}
								className="border-t border-gray-200"
							>
								<td className="px-6 py-4">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-500">
											{member.user.name
												.charAt(0)
												.toUpperCase()}
										</div>

										<div>
											<p className="font-medium text-gray-900">
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
													className="flex w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
												>
													Change role
												</button>

												<button
													type="button"
													onClick={() =>
														handleRemoveMember(member)
													}
													className="flex w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
												>
													Remove member
												</button>
											</div>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{projectMembers.length === 0 && (
					<div className="px-6 py-12 text-center text-sm text-gray-500">
						No project members found.
					</div>
				)}
			</div>

			<AddProjectMemberModal
				isOpen={isAddMemberOpen}
				isLoading={isAddingMember}
				onClose={() => setIsAddMemberOpen(false)}
				onSubmit={handleAddMember}
			/>

			<ChangeProjectMemberRoleModal
				isOpen={isRoleModalOpen}
				member={selectedMember}
				isSubmitting={isUpdatingRole}
				onClose={() => {
					setIsRoleModalOpen(false);
					setSelectedMember(null);
				}}
				onSubmit={handleChangeRole}
			/>
		</div>
	);
};

export default ProjectMembers;
