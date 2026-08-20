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

  const [isEditing, setIsEditing] = useState(false);
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

      const response = await updateUserProfile({
        name: data.name?.trim(),
        bio: data.bio?.trim() ?? "",
      });

      const updatedUser = response.data.data.user;

      setUser(updatedUser);
      setIsEditing(false);

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

  const handleCancelEdit = () => {
    reset({
      name: user?.name ?? "",
      bio: user?.bio ?? "",
    });

    setIsEditing(false);
    setMessage(null);
  };

  if (!user) {
    return (
      <div className="text-sm text-gray-500">
        No user information available.
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Profile
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setMessage(null);
            }}
            className="text-sm font-medium text-orange-500 transition-colors hover:text-orange-600"
          >
            Edit
          </button>
        )}
      </div>

      <div className="mt-6">
        {isEditing ? (
          <form
            onSubmit={handleSubmit(handleProfileUpdate)}
            className="space-y-6"
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
              value={user.email}
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
                {...register("bio", {
                  maxLength: {
                    value: 250,
                    message:
                      "Bio cannot exceed 250 characters.",
                  },
                })}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />

              {errors.bio && (
                <p className="text-sm text-red-500">
                  {errors.bio.message}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSaving || !isDirty}
                className=""
              >
                {isSaving
                  ? "Saving..."
                  : "Save Changes"}
              </Button>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium text-gray-500">
                Name
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">
                Email
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">
                Bio
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                {user.bio || "No bio provided."}
              </p>
            </div>
          </div>
        )}
      </div>

      {message && (
        <p
          className={`mt-6 text-sm ${
            message.type === "success"
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
};

export default ProfileSettings;