import { useState } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import {
  changeUserPassword,
  type ChangePasswordProps,
} from "@/api/auth.api";

interface PasswordFormValues extends ChangePasswordProps {
  confirmPassword: string;
}

const PasswordSettings = () => {
  const [isChangingPassword, setIsChangingPassword] =
    useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
      isDirty,
    },
  } = useForm<PasswordFormValues>();

  const newPassword = watch("newPassword");

  const handleChangePassword = async (
    data: PasswordFormValues,
  ) => {
    try {
      setIsChangingPassword(true);
      setMessage(null);

      await changeUserPassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      reset();

      setMessage({
        type: "success",
        text: "Password changed successfully.",
      });
    } catch (error) {
      console.error(
        "Failed to change password:",
        error,
      );

      setMessage({
        type: "error",
        text: "Failed to change password. Please check your current password.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleChangePassword)}
      className="max-w-2xl space-y-6"
    >
      <Input
        id="currentPassword"
        label="Current Password"
        type="password"
        placeholder="Enter your current password"
        error={errors.currentPassword?.message}
        {...register("currentPassword", {
          required:
            "Current password is required.",
        })}
      />

      <Input
        id="newPassword"
        label="New Password"
        type="password"
        placeholder="Enter your new password"
        error={errors.newPassword?.message}
        {...register("newPassword", {
          required:
            "New password is required.",
          minLength: {
            value: 8,
            message:
              "Password must be at least 8 characters.",
          },
        })}
      />

      <Input
        id="confirmPassword"
        label="Confirm New Password"
        type="password"
        placeholder="Confirm your new password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required:
            "Please confirm your new password.",
          validate: (value) =>
            value === newPassword ||
            "Passwords do not match.",
        })}
      />

      <div className="flex flex-col items-center gap-4">
        <Button
          type="submit"
          disabled={
            isChangingPassword || !isDirty
          }
          className="w-auto"
        >
          {isChangingPassword
            ? "Changing Password..."
            : "Change Password"}
        </Button>

        {message && (
          <p
            className={
              message.type === "success"
                ? "text-sm text-green-600"
                : "text-sm text-red-500"
            }
          >
            {message.text}
          </p>
        )}
      </div>
    </form>
  );
};

export default PasswordSettings;