import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { MoreVertical } from "lucide-react";

import { useOrganizationStore } from "@/store/organization.store";
import { type OrganizationMemberProps } from "@/api/organization.api";
import InviteMemberModal from "./InviteMemberModal";
import ChangeOrganizationMemberRoleModal from "./ChangeOrganizationMemberRoleModal";
import RemoveOrganizationMemberModal from "./RemoveOrganizationMemberModal";
import MemberToolbar from "@/components/members/MemberToolbar";
import MemberTable, { type CommonMemberProps } from "@/components/members/MemberTable";

const OrganizationMembers = () => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [invitationUrl, setInvitationUrl] = useState<string | null>(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const [selectedMember, setSelectedMember] =
    useState<OrganizationMemberProps | null>(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const [isUpdatingRole, setIsUpdatingRole] = useState(false);

  const { organizationSlug } = useParams<{
    organizationSlug: string;
  }>();

  const {
    organizationMembers,
    isMembersLoading,
    fetchOrganizationMembers,
    inviteOrganizationMember,
    updateOrganizationMemberRole,
    removeOrganizationMember,
  } = useOrganizationStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!organizationSlug) {
      return;
    }

    fetchOrganizationMembers(organizationSlug);
  }, [organizationSlug, fetchOrganizationMembers]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return organizationMembers;
    }

    return organizationMembers.filter((member) => {
      return (
        member.user.name.toLowerCase().includes(query) ||
        member.user.email.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.status.toLowerCase().includes(query)
      );
    });
  }, [organizationMembers, search]);

  const commonMembers: CommonMemberProps[] = filteredMembers.map((member) => ({
    id: member.id,
    name: member.user.name,
    email: member.user.email,
    role: member.role,
    status: member.status,
    joinedAt: member.joinedAt,
  }));

  const handleRemoveMember = (member: OrganizationMemberProps) => {
    setSelectedMember(member);
    setIsRemoveModalOpen(true);
    setOpenMenuId(null);
  };

  const handleConfirmRemove = async () => {
    if (!organizationSlug || !selectedMember) {
      return;
    }

    try {
      setIsRemoving(true);

      const success = await removeOrganizationMember(
        organizationSlug,
        selectedMember.id,
      );

      if (!success) {
        return;
      }

      setIsRemoveModalOpen(false);
      setSelectedMember(null);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleInviteMember = async (data: {
    email: string;
    role: "MEMBER" | "ADMIN";
  }) => {
    if (!organizationSlug) {
      return;
    }

    try {
      setIsInviting(true);

      const inviteUrl = await inviteOrganizationMember(organizationSlug, data);
      console.log("Invite URL:", inviteUrl);

      if (!inviteUrl) {
        return;
      }

      setInvitationUrl(inviteUrl);
      setIsInviteModalOpen(false);
    } finally {
      setIsInviting(false);
    }
  };

  const handleChangeRole = async (role: "ADMIN" | "MEMBER") => {
    if (!organizationSlug || !selectedMember) {
      return;
    }

    try {
      setIsUpdatingRole(true);

      const updatedMember = await updateOrganizationMemberRole(
        organizationSlug,
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

  if (isMembersLoading) {
    return <div className="text-sm text-gray-500">Loading members...</div>;
  }

  return (
    <>
      <div className="space-y-6">
		<MemberToolbar search={search} onSearchChange={setSearch} onAddMember={() => setIsInviteModalOpen(true)} addLabel="Invite Member" />

		<div className="relative">
		  <MemberTable
		    members={commonMembers}
		    showStatus
		    onChangeRole={(member) => {
		      setSelectedMember(organizationMembers.find((item) => item.id === member.id) ?? null);
		      setIsRoleModalOpen(true);
		    }}
		    onRemove={(member) => {
		      const original = organizationMembers.find((item) => item.id === member.id);
		      if (original) handleRemoveMember(original);
		    }}
		    canManage={(member) => member.role !== "OWNER"}
		  />
          <InviteMemberModal
            isOpen={isInviteModalOpen}
            isSubmitting={isInviting}
            onClose={() => setIsInviteModalOpen(false)}
            onSubmit={handleInviteMember}
          />
        </div>
        {false && <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm">
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
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Joined
                </th>

                <th />
              </tr>
            </thead>

            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-t border-gray-200">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-500">
                        {member.user.name.charAt(0)}
                      </div>

                      <div>
                        <p className="font-medium">{member.user.name}</p>

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

                  <td className="px-6 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600">
                      {member.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    {member.role !== "OWNER" && (
                      <div className="relative inline-block">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenuId((current) =>
                              current === member.id ? null : member.id,
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
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Change role
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                handleRemoveMember(member);
                              }}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
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
          <InviteMemberModal
            isOpen={isInviteModalOpen}
            isSubmitting={isInviting}
            onClose={() => setIsInviteModalOpen(false)}
            onSubmit={handleInviteMember}
          />
        </div>}

        {filteredMembers.length === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">
            No members found.
          </div>
        )}
      </div>

      <ChangeOrganizationMemberRoleModal
        isOpen={isRoleModalOpen}
        member={selectedMember}
        isSubmitting={isUpdatingRole}
        onClose={() => {
          setIsRoleModalOpen(false);
          setSelectedMember(null);
        }}
        onSubmit={handleChangeRole}
      />

      <RemoveOrganizationMemberModal
        isOpen={isRemoveModalOpen}
        member={selectedMember}
        isSubmitting={isRemoving}
        onClose={() => {
          setIsRemoveModalOpen(false);
          setSelectedMember(null);
        }}
        onConfirm={handleConfirmRemove}
      />
    </>
  );
};

export default OrganizationMembers;
