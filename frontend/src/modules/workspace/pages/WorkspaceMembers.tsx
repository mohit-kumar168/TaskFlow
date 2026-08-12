import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getWorkspaceMembers } from "@/api/workspace.api";

import Membertoolbar from "@/modules/workspace/components/Membertoolbar";
import MemberTable from "@/modules/workspace/components/MemberTable";

export interface WorkspaceMemberWithUser {
	id: string;
	role: "OWNER" | "ADMIN" | "MEMBER";
	status: "active" | "inactive";
	joinedAt: string;
	user: {
		id: string;
		name: string;
		email: string;
	};
}

const WorkspaceMembers = () => {
	const {
		organizationSlug,
		workspaceSlug,
	} = useParams<{
		organizationSlug: string;
		workspaceSlug: string;
	}>();

	const [members, setMembers] = useState<
		WorkspaceMemberWithUser[]
	>([]);

	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!organizationSlug || !workspaceSlug) {
			return;
		}

		const loadMembers = async () => {
			try {
				setIsLoading(true);

				const response = await getWorkspaceMembers(
					organizationSlug,
					workspaceSlug,
				);

				setMembers(response.data.data);
			} catch (error) {
				console.error(
					"Failed to fetch workspace members:",
					error,
				);

				setMembers([]);
			} finally {
				setIsLoading(false);
			}
		};

		loadMembers();
	}, [organizationSlug, workspaceSlug]);

	if (isLoading) {
		return <div>Loading members...</div>;
	}

	return (
		<div className="space-y-6">
			<Membertoolbar />
			<MemberTable members={members} />
		</div>
	);
};

export default WorkspaceMembers;