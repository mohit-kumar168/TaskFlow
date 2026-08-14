import { useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";

interface AddMemberModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: {
    email: string;
    role: "MEMBER" | "ADMIN";
  }) => Promise<void>;
}

const AddMemberModal = ({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: AddMemberModalProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] =
    useState<"MEMBER" | "ADMIN">("MEMBER");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!email.trim()) {
      return;
    }

    await onSubmit({
      email: email.trim(),
      role,
    });

    setEmail("");
    setRole("MEMBER");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Add Member
            </h2>

            <p className="text-sm text-gray-500">
              Add an existing organization member to this workspace.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="member-email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="member-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="member@example.com"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-orange-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="member-role"
              className="text-sm font-medium text-gray-700"
            >
              Role
            </label>

            <select
              id="member-role"
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value as
                    | "MEMBER"
                    | "ADMIN",
                )
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-orange-500"
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <Button
              type="submit"
              disabled={isSubmitting || !email.trim()}
            >
              {isSubmitting
                ? "Adding..."
                : "Add Member"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;