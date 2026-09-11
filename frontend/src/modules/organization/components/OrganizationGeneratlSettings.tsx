import { Building2, Pencil, Trash2 } from "lucide-react";
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
    formState: { errors, isDirty },
  } = useForm<OrganizationFormData>({
    defaultValues: {
      name: currentOrganization?.name ?? "",
      description: currentOrganization?.description ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: currentOrganization?.name ?? "",
      description: currentOrganization?.description ?? "",
    });
  }, [currentOrganization, reset]);

  const handleUpdate = async (data: OrganizationFormData) => {
    if (!currentOrganization) {
      return;
    }

    const updatedOrganization = await updateOrganization(
      currentOrganization.slug,
      {
        name: data.name.trim(),
        description: data.description?.trim() ?? "",
      },
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

  return (
    <>
      <div className="space-y-8">
        {/* Organization Information */}
        <section>
          <div className="flex items-start justify-between border-b border-gray-100 pb-5">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-base font-semibold text-gray-900">
                  Organization Information
                </h3>

                <p className="mt-0.5 text-sm text-gray-500">
                  Manage your organization's basic information.
                </p>
              </div>
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
                className="space-y-5"
              >
                <Input
                  id="name"
                  label="Organization Name"
                  error={errors.name?.message}
                  {...register("name", {
                    required: "Organization name is required.",
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

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    rows={5}
                    placeholder="Describe your organization..."
                    {...register("description", {
                      maxLength: {
                        value: 500,
                        message:
                          "Description cannot exceed 500 characters.",
                      },
                    })}
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  />

                  {errors.description && (
                    <p className="text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !isDirty}
                    className="w-auto"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>

                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="mb-1.5 text-xs font-medium text-gray-500">
                    Organization Name
                  </p>

                  <p className="text-sm font-medium text-gray-900">
                    {currentOrganization.name}
                  </p>
                </div>

                <div>
                  <p className="mb-1.5 text-xs font-medium text-gray-500">
                    Description
                  </p>

                  <p className="max-w-2xl text-sm leading-6 text-gray-700">
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
                <p className="text-xs md:text-sm font-medium text-gray-900">
                  Delete Organization
                </p>

                <p className="hidden md:block mt-1 text-xs text-gray-500">
                  Permanently delete this organization and all
                  associated data.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDeleteOrganization}
                disabled={isDeleting || isLoading}
                className="shrink-0 rounded-lg border border-red-300 bg-white px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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