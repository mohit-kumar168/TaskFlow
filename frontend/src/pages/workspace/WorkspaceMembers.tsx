import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getWorkspaceMembers } from "@/api/workspace.api";
import Membertoolbar from "@/components/workspace/Membertoolbar";
import MemberTable from "@/components/workspace/MemberTable";

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
};

const WorkspaceMembers = () => {
	const { workspaceId } = useParams();
	const [members, setMembers] = useState<WorkspaceMemberWithUser[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!workspaceId) return;

		const loadMembers = async () => {
			try {
				setIsLoading(true);
				const response = await getWorkspaceMembers(workspaceId);
				setMembers(response.data.data);
			} finally {
				setIsLoading(false);
			}
		};

		loadMembers();
	}, [workspaceId]);

	if (isLoading) return <div>Loading members...</div>;

	return (
		<div className="space-y-6">
			<Membertoolbar />
			<MemberTable members={members} />
		</div>
	);
};

export default WorkspaceMembers;   
