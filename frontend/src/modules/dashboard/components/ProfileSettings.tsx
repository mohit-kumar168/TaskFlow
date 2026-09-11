import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useForm } from "react-hook-form";

import Button from "@/modules/common/components/ui/Button";
import Input from "@/modules/common/components/ui/Input";

import {
  updateUserProfile,
  type UpdateUserProfileProps,
} from "@/api/auth.api";

import { useAuthStore } from "@/store/auth.store";

const ProfileSettings = () => {
  const { user, setUser } = useAuthStore();

  const [isSaving, setIsSaving] = useState(false);
  const [selectedAvatar, setSelectedAvatar] =
    useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] =
    useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateUserProfileProps>({
    defaultValues: {
      name: user?.name ?? "",
      bio: user?.bio ?? "",
    },
  });

  useEffect(() => {
    setSelectedAvatar(null);
    setAvatarPreview(null);
  }, [user]);

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

    if (file.size > 5 * 1024 * 1024) {
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

      setMessage({
        type: "success",
        text: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update profile:", error);

      setMessage({
        type: "error",
        text: "Failed to update profile.",
      });
    } finally {
      setIsSaving(false);
    }
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
    <div className="py-4 max-w-3xl">
      {/* Form */}
      <form
        onSubmit={handleSubmit(handleProfileUpdate)}
        className="space-y-2 px-6"
      >
        {/* Profile Picture */}
        <div>
          <label className="text-xs font-medium text-gray-700">
            Profile picture
          </label>

          <div className="mt-3 flex items-center justify-between">
            <div className="relative">
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover ring-1 ring-gray-200"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-xl font-semibold text-gray-500">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Camera button */}
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
                aria-label="Change profile picture"
              >
                <Camera size={14} />
              </button>
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Change Photo
              </button>
            </div>
          </div>

          <p className="mt-2 text-[11px] text-gray-400">
            JPG, PNG or WEBP. Maximum 5MB.
          </p>
        </div>

        {/* Name */}
        <Input
          id="name"
          label="Full Name"
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

        {/* Email */}
        <Input
          id="email"
          label="Email Address"
          type="email"
          value={user.email}
          disabled
        />

        {/* Bio */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="bio"
            className="text-xs font-medium text-gray-700"
          >
            Bio
          </label>

          <div className="relative">
            <textarea
              id="bio"
              rows={4}
              maxLength={250}
              placeholder="Tell us a little about yourself..."
              {...register("bio", {
                maxLength: {
                  value: 250,
                  message:
                    "Bio cannot exceed 250 characters.",
                },
              })}
              className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2.5 text-xs text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
            />

            <span className="absolute bottom-2 right-3 text-[10px] text-gray-400">
              {user.bio?.length ?? 0}/250
            </span>
          </div>

          {errors.bio && (
            <p className="text-xs text-red-500">
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Message */}
        {message && (
          <p
            className={`text-xs ${
              message.type === "success"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Save */}
        <div className="flex justify-end pt-1">
          <Button
            type="submit"
            disabled={
              isSaving ||
              (!isDirty && !selectedAvatar)
            }
            className="rounded-lg px-5 py-2 text-xs font-medium"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;