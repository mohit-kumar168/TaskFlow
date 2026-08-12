import React from "react";
import { type WorkspaceMemberWithUser } from "@/modules/workspace/pages/WorkspaceMembers";
import { MoreVertical } from "lucide-react";

const MemberTable = ({ members }: { members: WorkspaceMemberWithUser[] }) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold">
              Member
            </th>

            <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>

            <th className="px-6 py-4 text-left text-sm font-semibold">
              Joined
            </th>

            <th />
          </tr>
        </thead>

        <tbody>
          {members.map((member) => (
            <tr key={member.user.email} className="border-t border-gray-200">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-500">
                    {member.user.name.charAt(0)}
                  </div>

                  <div>
                    <p className="font-medium">{member.user.name}</p>
                    <p className="text-sm text-gray-500">{member.user.email}</p>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                  {member.role}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-500">
                {new Date(member.joinedAt).toLocaleDateString()}
              </td>

              <td className="px-6 py-4 text-right">
                <button className="rounded-lg p-2 hover:bg-gray-100">
                  <MoreVertical size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberTable;
