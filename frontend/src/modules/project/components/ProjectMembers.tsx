import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useProjectStore } from "@/store/project.store";
import type { ProjectMemberProps } from "@/api/project.api";
import MemberToolbar from "@/components/members/MemberToolbar";
import MemberTable, { type CommonMemberProps } from "@/components/members/MemberTable";
import AddMemberModal from "@/components/members/AddMemberModal";
import MemberRoleChange, { type MemberRole } from "@/components/members/MemberRoleChange";
import FeedbackModal from "@/components/ui/FeedBackModal";

const ProjectMembers = () => {
	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [selectedMember, setSelectedMember] = useState<ProjectMemberProps | null>(null);
	const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
	const [isUpdatingRole, setIsUpdatingRole] = useState(false);
	const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
	const [isAddingMember, setIsAddingMember] = useState(false);
	const [search, setSearch] = useState("");
	const [feedback, setFeedback] = useState({ isOpen: false, type: "success" as "success" | "error", title: "", message: "" });

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

	const filteredMembers = useMemo(() => {
		const query = search.trim().toLowerCase();
		return projectMembers.filter((member) =>
			!query || [member.user.name, member.user.email, member.role]
				.some((value) => value.toLowerCase().includes(query)),
		);
	}, [projectMembers, search]);

	const commonMembers: CommonMemberProps[] = filteredMembers.map((member) => ({
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
				{ email: data.email, role: data.role as "ADMIN" | "MEMBER" },
			);

			if (success) {
				setIsAddMemberOpen(false);
				setFeedback({ isOpen: true, type: "success", title: "Member Added", message: "The member was added to the project." });
			} else {
				setFeedback({ isOpen: true, type: "error", title: "Unable to Add Member", message: "The member could not be added to the project." });
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

	const handleChangeRole = async (role: MemberRole) => {
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
					role as "ADMIN" | "MEMBER",
				);

			if (!updatedMember) {
				return;
			}

			setIsRoleModalOpen(false);
			setSelectedMember(null);
			setFeedback({ isOpen: true, type: "success", title: "Role Updated", message: "The project member role was updated." });
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

		const removed = await removeProjectMember(
			organizationSlug,
			workspaceSlug,
			projectSlug,
			member.id,
		);
		setFeedback({ isOpen: true, type: removed ? "success" : "error", title: removed ? "Member Removed" : "Unable to Remove Member", message: removed ? "The member was removed from the project." : "The member could not be removed from the project." });
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
			<MemberToolbar search={search} onSearchChange={setSearch} onAddMember={() => setIsAddMemberOpen(true)} />
			<div className="mt-5">
				<MemberTable
					members={commonMembers}
					onChangeRole={(member) => {
						setSelectedMember(projectMembers.find((item) => item.id === member.id) ?? null);
						setIsRoleModalOpen(true);
					}}
					onRemove={(member) => {
						const original = projectMembers.find((item) => item.id === member.id);
						if (original) void handleRemoveMember(original);
					}}
				/>
			</div>

			<AddMemberModal
				isOpen={isAddMemberOpen}
				isSubmitting={isAddingMember}
				roles={[{ value: "MEMBER", label: "Member" }, { value: "ADMIN", label: "Admin" }]}
				onClose={() => setIsAddMemberOpen(false)}
				onSubmit={handleAddMember}
			/>

			<MemberRoleChange
				isOpen={isRoleModalOpen}
				memberName={selectedMember?.user.name ?? ""}
				currentRole={(selectedMember?.role as MemberRole) ?? "MEMBER"}
				roles={["ADMIN", "MEMBER"]}
				isSubmitting={isUpdatingRole}
				onClose={() => {
					setIsRoleModalOpen(false);
					setSelectedMember(null);
				}}
				onSubmit={(role) => handleChangeRole(role as "ADMIN" | "MEMBER")}
			/>
			<FeedbackModal {...feedback} onClose={() => setFeedback((current) => ({ ...current, isOpen: false }))} />
		</div>
	);
};

export default ProjectMembers;
