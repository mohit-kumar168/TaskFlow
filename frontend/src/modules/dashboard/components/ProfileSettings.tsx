import { useEffect, useRef, useState } from "react";
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

  const [selectedAvatar, setSelectedAvatar] =
    useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] =
    useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(
    null,
  );

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

    setSelectedAvatar(null);
    setAvatarPreview(null);
  }, [user, reset]);

  const handleAvatarChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "Only JPG, PNG, and WEBP images are allowed.",
      });

      event.target.value = "";
      return;
    }

    const maxFileSize = 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setMessage({
        type: "error",
        text: "Image size cannot exceed 5MB.",
      });

      event.target.value = "";
      return;
    }

    setSelectedAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
    setMessage(null);
  };

  const handleProfileUpdate = async (
    data: UpdateUserProfileProps,
  ) => {
    try {
      setIsSaving(true);
      setMessage(null);

      const response = await updateUserProfile({
        name: data.name?.trim(),
        bio: data.bio?.trim() ?? "",
        avatar: selectedAvatar ?? undefined,
      });

      const updatedUser = response.data.data.user;

      setUser(updatedUser);

      setSelectedAvatar(null);
      setAvatarPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

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

    setSelectedAvatar(null);
    setAvatarPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

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

  const currentAvatar =
    avatarPreview ?? user.avatarUrl;

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
            {/* Avatar */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Profile picture
              </label>

              <div className="mt-3 flex items-center gap-4">
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt="Profile"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-500">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="block text-sm text-gray-600"
                  />

                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG or WEBP. Maximum 5MB.
                  </p>
                </div>
              </div>
            </div>

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
                disabled={isSaving || (!isDirty && !selectedAvatar)}
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
            {/* Avatar */}
            <div>
              <p className="text-xs font-medium text-gray-500">
                Profile picture
              </p>

              <div className="mt-2">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Profile"
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-lg font-semibold text-gray-500">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

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
          className={`mt-6 text-sm ${message.type === "success"
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
