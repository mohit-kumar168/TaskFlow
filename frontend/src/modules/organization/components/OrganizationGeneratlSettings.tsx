import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Button from "@/modules/common/components/ui/Button";
import Input from "@/modules/common/components/ui/Input";
import FeedbackModal from "@/modules/common/components/ui/FeedBackModal";
import { useOrganizationStore } from "@/store/organization.store";

type OrganizationFormData = {
  name: string;
  description?: string;
  logo: FileList;
};

const OrganizationGeneralSettings = () => {
  const {
    currentOrganization,
    updateOrganization,
    archiveOrganization,
    isLoading,
  } = useOrganizationStore();

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [feedback, setFeedback] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
    shouldNavigate: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<OrganizationFormData>({
    defaultValues: {
      name: currentOrganization?.name ?? "",
      description: currentOrganization?.description ?? "",
    },
  });

  const selectedLogo = watch("logo");

  useEffect(() => {
    reset({
      name: currentOrganization?.name ?? "",
      description: currentOrganization?.description ?? "",
    });

    setLogoPreview(null);
  }, [currentOrganization, reset]);

  useEffect(() => {
    if (!selectedLogo?.[0]) {
      setLogoPreview(null);
      return;
    }

    const file = selectedLogo[0];

    if (!file.type.startsWith("image/")) {
      setLogoPreview(null);
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedLogo]);

  const handleUpdate = async (data: OrganizationFormData) => {
    if (!currentOrganization) {
      return;
    }

    const formData = new FormData();

    formData.append("name", data.name.trim());
    formData.append(
      "description",
      data.description?.trim() ?? "",
    );

    if (data.logo?.[0]) {
      formData.append("logo", data.logo[0]);
    }

    const updatedOrganization = await updateOrganization(
      currentOrganization.slug,
      formData,
    );

    if (!updatedOrganization) {
      setFeedback({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: "Unable to update the organization.",
        shouldNavigate: false,
      });

      return;
    }

    setIsEditing(false);
    setLogoPreview(null);

    setFeedback({
      isOpen: true,
      type: "success",
      title: "Organization Updated",
      message: "Organization updated successfully.",
      shouldNavigate: false,
    });
  };

  const handleCancelEdit = () => {
    reset({
      name: currentOrganization?.name ?? "",
      description: currentOrganization?.description ?? "",
    });

    setLogoPreview(null);
    setIsEditing(false);
  };

  const handleDeleteOrganization = async () => {
    if (!currentOrganization) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${currentOrganization.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      const deleted = await archiveOrganization(
        currentOrganization.slug,
      );

      if (!deleted) {
        setFeedback({
          isOpen: true,
          type: "error",
          title: "Deletion Failed",
          message: "Unable to delete the organization.",
          shouldNavigate: false,
        });

        return;
      }

      setFeedback({
        isOpen: true,
        type: "success",
        title: "Organization Deleted",
        message: "Organization deleted successfully.",
        shouldNavigate: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!currentOrganization) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">
          No organization selected.
        </p>
      </div>
    );
  }

  const currentLogo =
    logoPreview ?? currentOrganization.logoUrl;

  return (
    <>
      <div className="space-y-8">
        {/* Organization Information */}
        <section>
          <div className="flex items-start justify-between border-b border-gray-100 pb-5">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Organization Information
              </h3>

              <p className="mt-0.5 text-sm text-gray-500">
                Manage your organization's basic information.
              </p>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-orange-500 transition-colors hover:bg-orange-50 hover:text-orange-600"
              >
                <Pencil size={15} />
                Edit
              </button>
            )}
          </div>

          <div className="pt-6">
            {isEditing ? (
              <form
                onSubmit={handleSubmit(handleUpdate)}
                className="space-y-6"
              >
                {/* Organization Logo */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Organization Logo
                  </label>

                  <div className="mt-3 flex items-center gap-4">
                    {currentLogo ? (
                      <img
                        src={currentLogo}
                        alt={`${currentOrganization.name} logo`}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500 text-xl font-semibold text-white">
                        {currentOrganization.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        {...register("logo")}
                        className="block text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-orange-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-orange-600 hover:file:bg-orange-100"
                      />

                      <p className="mt-1 text-xs text-gray-500">
                        JPG, PNG or WEBP. Maximum 10MB.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Organization Name */}
                <Input
                  id="name"
                  label="Organization Name"
                  error={errors.name?.message}
                  {...register("name", {
                    required:
                      "Organization name is required.",
                    minLength: {
                      value: 2,
                      message:
                        "Organization name must be at least 2 characters.",
                    },
                    maxLength: {
                      value: 100,
                      message:
                        "Organization name cannot exceed 100 characters.",
                    },
                  })}
                />

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    rows={4}
                    placeholder="Describe your organization..."
                    {...register("description", {
                      maxLength: {
                        value: 500,
                        message:
                          "Description cannot exceed 500 characters.",
                      },
                    })}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />

                  {errors.description && (
                    <p className="text-sm text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    className="w-auto"
                  >
                    {isLoading
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Logo */}
                <div>
                  <p className="mb-2 text-xs font-medium text-gray-500">
                    Organization Logo
                  </p>

                  {currentOrganization.logoUrl ? (
                    <img
                      src={currentOrganization.logoUrl}
                      alt={`${currentOrganization.name} logo`}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-xl font-semibold text-white">
                      {currentOrganization.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Organization Name
                  </p>

                  <p className="mt-1 text-sm text-gray-900">
                    {currentOrganization.name}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Description
                  </p>

                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-700">
                    {currentOrganization.description ||
                      "No description provided."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="border-t border-red-100 pt-7">
          <div className="rounded-lg border border-red-100 bg-red-50/40 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500">
                <Trash2 size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-red-600">
                  Danger Zone
                </h3>

                <p className="mt-1 text-xs text-red-500/80">
                  These actions are permanent and cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-6 border-t border-red-100 pt-5">
              <div>
                <p className="text-xs font-medium text-gray-900 md:text-sm">
                  Delete Organization
                </p>

                <p className="mt-1 hidden text-xs text-gray-500 md:block">
                  Permanently delete this organization and all
                  associated data.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDeleteOrganization}
                disabled={isDeleting || isLoading}
                className="shrink-0 rounded-lg border border-red-300 bg-white px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 md:px-4 md:py-2 md:text-sm"
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete Organization"}
              </button>
            </div>
          </div>
        </section>
      </div>

      <FeedbackModal
        {...feedback}
        onClose={() => {
          setFeedback((current) => ({
            ...current,
            isOpen: false,
          }));

          if (feedback.shouldNavigate) {
            navigate("/dashboard");
          }
        }}
      />
    </>
  );
};

export default OrganizationGeneralSettings;
