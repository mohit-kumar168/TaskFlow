import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import MemberToolbar from "@/components/members/MemberToolbar";
import MemberTable, { type CommonMemberProps } from "@/components/members/MemberTable";
import AddMemberModal from "@/components/members/AddMemberModal";
import MemberRoleChange, { type MemberRole } from "@/components/members/MemberRoleChange";
import FeedbackModal from "@/components/ui/FeedBackModal";

import { useWorkspaceStore } from "@/store/workspace.store";

const WorkspaceMembers = () => {
	const {
		organizationSlug,
		workspaceSlug,
	} = useParams<{
		organizationSlug: string;
		workspaceSlug: string;
	}>();

	const {
		members,
		isMembersLoading,
		fetchWorkspaceMembers,
		addWorkspaceMember,
		updateWorkspaceMemberRole,
		removeWorkspaceMember,
	} = useWorkspaceStore();

	const [search, setSearch] = useState("");
	const [isAddMemberOpen, setIsAddMemberOpen] =
		useState(false);
	const [isAddingMember, setIsAddingMember] =
		useState(false);
	const [selectedMember, setSelectedMember] = useState<CommonMemberProps | null>(null);
	const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
	const [isUpdatingRole, setIsUpdatingRole] = useState(false);
	const [feedback, setFeedback] = useState({ isOpen: false, type: "success" as "success" | "error", title: "", message: "" });

	useEffect(() => {
		if (!organizationSlug || !workspaceSlug) {
			return;
		}

		fetchWorkspaceMembers(
			organizationSlug,
			workspaceSlug,
		);
	}, [
		organizationSlug,
		workspaceSlug,
		fetchWorkspaceMembers,
	]);

	const filteredMembers = useMemo(() => {
		const query = search.trim().toLowerCase();

		if (!query) {
			return members;
		}

		return members.filter((member) => {
			return (
				member.user.name
					.toLowerCase()
					.includes(query) ||
				member.user.email
					.toLowerCase()
					.includes(query) ||
				member.role
					.toLowerCase()
					.includes(query)
			);
		});
	}, [members, search]);

	const commonMembers = filteredMembers.map((member) => ({
		id: member.id,
		name: member.user.name,
		email: member.user.email,
		role: member.role,
		joinedAt: member.joinedAt,
	}));

	const handleAddMember = async (data: {
		email: string;
		role: string;
	}) => {
		if (!organizationSlug || !workspaceSlug) {
			return;
		}

		try {
			setIsAddingMember(true);

			await addWorkspaceMember(
				organizationSlug,
				workspaceSlug,
				{ email: data.email, role: data.role as "MEMBER" | "ADMIN" },
			);

			setIsAddMemberOpen(false);
			setFeedback({ isOpen: true, type: "success", title: "Member Added", message: "The member was added to the workspace." });
		} catch (error) {
			setFeedback({ isOpen: true, type: "error", title: "Unable to Add Member", message: "The member could not be added to the workspace." });
			console.error(
				"Failed to add workspace member:",
				error,
			);
		} finally {
			setIsAddingMember(false);
		}
	};

	const handleChangeRole = async (role: MemberRole) => {
		if (!organizationSlug || !workspaceSlug || !selectedMember) return;
		try {
			setIsUpdatingRole(true);
			await updateWorkspaceMemberRole(organizationSlug, workspaceSlug, selectedMember.id, role as "ADMIN" | "MEMBER");
			setIsRoleModalOpen(false);
			setSelectedMember(null);
			setFeedback({ isOpen: true, type: "success", title: "Role Updated", message: "The workspace member role was updated." });
		} finally {
			setIsUpdatingRole(false);
		}
	};

	if (isMembersLoading) {
		return <div>Loading members...</div>;
	}

	return (
		<>
			<div className="space-y-6">
				<MemberToolbar
					search={search}
					onSearchChange={setSearch}
					onAddMember={() =>
						setIsAddMemberOpen(true)
					}
				/>

				<MemberTable
					members={commonMembers}
					onChangeRole={(member) => {
						setSelectedMember(member);
						setIsRoleModalOpen(true);
					}}
					onRemove={(member) => {
						if (organizationSlug && workspaceSlug) {
							void removeWorkspaceMember(organizationSlug, workspaceSlug, member.id).then(() => setFeedback({ isOpen: true, type: "success", title: "Member Removed", message: "The member was removed from the workspace." })).catch(() => setFeedback({ isOpen: true, type: "error", title: "Unable to Remove Member", message: "The member could not be removed from the workspace." }));
						}
					}}
					canManage={(member) => member.role !== "OWNER"}
				/>
			</div>

			<AddMemberModal
				isOpen={isAddMemberOpen}
				isSubmitting={isAddingMember}
				roles={[{ value: "MEMBER", label: "Member" }, { value: "ADMIN", label: "Admin" }]}
				onClose={() =>
					setIsAddMemberOpen(false)
				}
				onSubmit={handleAddMember}
			/>
			<FeedbackModal {...feedback} onClose={() => setFeedback((current) => ({ ...current, isOpen: false }))} />
			<MemberRoleChange
				isOpen={isRoleModalOpen}
				memberName={selectedMember?.name ?? ""}
				currentRole={(selectedMember?.role as MemberRole) ?? "MEMBER"}
				roles={["ADMIN", "MEMBER"]}
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

export default WorkspaceMembers;
