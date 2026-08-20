import Button from "@/components/ui/Button";

interface RemoveOrganizationMemberModalProps {
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
  onConfirm: () => void;
}

const RemoveOrganizationMemberModal = ({
  isOpen,
  member,
  isSubmitting,
  onClose,
  onConfirm,
}: RemoveOrganizationMemberModalProps) => {
  if (!isOpen || !member) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Remove Member
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Remove this user from the organization?
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="font-medium text-gray-900">
              {member.user.name}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {member.user.email}
            </p>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            This member will lose access to this
            organization and its workspaces.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <Button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="w-auto bg-red-500 hover:bg-red-600"
            >
              {isSubmitting
                ? "Removing..."
                : "Remove Member"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveOrganizationMemberModal;