import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";

type Role = "ADMIN" | "MEMBER";

interface ChangeRoleFormValues {
  role: Role;
}

interface ChangeOrganizationMemberRoleModalProps {
  isOpen: boolean;
  member: {
    id: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    user: {
      name: string;
      email: string;
    };
  } | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (role: Role) => void;
}

const ChangeOrganizationMemberRoleModal = ({
  isOpen,
  member,
  isSubmitting,
  onClose,
  onSubmit,
}: ChangeOrganizationMemberRoleModalProps) => {
  const { register, handleSubmit, reset } = useForm<ChangeRoleFormValues>({
    defaultValues: {
      role: "MEMBER",
    },
  });

  useEffect(() => {
    if (member) {
      reset({
        role: member.role === "OWNER" ? "MEMBER" : member.role,
      });
    }
  }, [member, reset]);

  if (!isOpen || !member) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Change Member Role
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Update the role of this organization member.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((data) => onSubmit(data.role))}
          className="space-y-5 px-6 py-6"
        >
          <div>
            <p className="text-sm font-medium text-gray-900">
              {member.user.name}
            </p>

            <p className="mt-1 text-sm text-gray-500">{member.user.email}</p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="text-sm font-medium text-gray-700">
              Role
            </label>

            <select
              id="role"
              {...register("role")}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            >
              <option value="MEMBER">Member</option>

              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <Button type="submit" disabled={isSubmitting} className="w-auto">
              {isSubmitting ? "Updating..." : "Update Role"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeOrganizationMemberRoleModal;
