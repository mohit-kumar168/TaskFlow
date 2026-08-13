import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import {
  updateUserProfile,
  type UpdateUserProfileProps,
} from "@/api/auth.api";

import { useAuthStore } from "@/store/auth.store";

const ProfileSettings = () => {
  const { user, setUser } = useAuthStore();

  const [isSaving, setIsSaving] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateUserProfileProps>({
    defaultValues: {
      name: user?.name ?? "",
      bio: user?.bio ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: user?.name ?? "",
      bio: user?.bio ?? "",
    });
  }, [user, reset]);

  const handleProfileUpdate = async (
    data: UpdateUserProfileProps,
  ) => {
    try {
      setIsSaving(true);
      setMessage(null);

      const response = await updateUserProfile(data);

      const updatedUser = response.data.data.user;

      setUser(updatedUser);

      setMessage({
        type: "success",
        text: "Profile updated successfully.",
      });
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error,
      );

      setMessage({
        type: "error",
        text: "Failed to update profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleProfileUpdate)}
      className="max-w-2xl space-y-6"
    >
      <Input
        id="name"
        label="Name"
        placeholder="Enter your name"
        error={errors.name?.message}
        {...register("name", {
          required: "Name is required.",
          minLength: {
            value: 3,
            message:
              "Name must be at least 3 characters.",
          },
          maxLength: {
            value: 30,
            message:
              "Name cannot exceed 30 characters.",
          },
        })}
      />

      <Input
        id="email"
        label="Email"
        type="email"
        value={user?.email ?? ""}
        disabled
      />

      <div className="flex flex-col gap-2">
        <label
          htmlFor="bio"
          className="text-sm font-medium text-gray-700"
        >
          Bio
        </label>

        <textarea
          id="bio"
          rows={5}
          placeholder="Tell us a little about yourself..."
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
          {...register("bio", {
            maxLength: {
              value: 250,
              message:
                "Bio cannot exceed 250 characters.",
            },
          })}
        />

        {errors.bio && (
          <p className="text-sm text-red-500">
            {errors.bio.message}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button
          type="submit"
          disabled={isSaving || !isDirty}
          className="w-auto"
        >
          {isSaving ? "Saving..." : "Save Changes"}
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

export default ProfileSettings;