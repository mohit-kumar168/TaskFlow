import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import Membertoolbar from "@/modules/workspace/components/Membertoolbar";
import MemberTable from "@/modules/workspace/components/MemberTable";
import AddMemberModal from "../../../modules/workspace/components/AddMemberModal";

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
  } = useWorkspaceStore();

  const [search, setSearch] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] =
    useState(false);
  const [isAddingMember, setIsAddingMember] =
    useState(false);

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

  const handleAddMember = async (data: {
    email: string;
    role: "MEMBER" | "ADMIN";
  }) => {
    if (!organizationSlug || !workspaceSlug) {
      return;
    }

    try {
      setIsAddingMember(true);

      await addWorkspaceMember(
        organizationSlug,
        workspaceSlug,
        data,
      );

      setIsAddMemberOpen(false);
    } catch (error) {
      console.error(
        "Failed to add workspace member:",
        error,
      );
    } finally {
      setIsAddingMember(false);
    }
  };

  if (isMembersLoading) {
    return <div>Loading members...</div>;
  }

  return (
    <>
      <div className="space-y-6">
        <Membertoolbar
          search={search}
          onSearchChange={setSearch}
          onAddMember={() =>
            setIsAddMemberOpen(true)
          }
        />

        <MemberTable members={filteredMembers} />
      </div>

      <AddMemberModal
        isOpen={isAddMemberOpen}
        isSubmitting={isAddingMember}
        onClose={() =>
          setIsAddMemberOpen(false)
        }
        onSubmit={handleAddMember}
      />
    </>
  );
};

export default WorkspaceMembers;