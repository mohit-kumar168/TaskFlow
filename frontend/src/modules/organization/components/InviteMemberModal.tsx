import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface InviteMemberFormValues {
  email: string;
  role: "MEMBER" | "ADMIN";
}

interface InviteMemberModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: InviteMemberFormValues) => void;
}

const InviteMemberModal = ({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: InviteMemberModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteMemberFormValues>({
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  if (!isOpen) {
    return null;
  }

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Invite Member
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Invite someone to join your organization.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="text-xl text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 px-6 py-6"
        >
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="Enter member email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required.",
            })}
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="role"
              className="text-sm font-medium text-gray-700"
            >
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

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-auto"
            >
              {isSubmitting
                ? "Sending..."
                : "Send Invitation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;