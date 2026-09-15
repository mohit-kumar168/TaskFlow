import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";

import Button from "@/modules/common/components/ui/Button";
import Input from "@/modules/common/components/ui/Input";

import { useWorkspaceStore } from "@/store/workspace.store";
import FeedbackModal from "@/modules/common/components/ui/FeedBackModal";

type WorkspaceFormData = {
  name: string;
  description: string;
  logo: FileList;
};

const WorkspaceSettings = () => {
  const navigate = useNavigate();

  const {
    organizationSlug,
    workspaceSlug,
  } = useParams<{
    organizationSlug: string;
    workspaceSlug: string;
  }>();

  const {
    currentWorkspace,
    updateWorkspace,
    archiveWorkspace,
    isLoading,
  } = useWorkspaceStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [feedback, setFeedback] = useState({
    isOpen: false,
    type: "success" as "success" | "error",
    title: "",
    message: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<WorkspaceFormData>({
    defaultValues: {
      name: currentWorkspace?.name ?? "",
      description: currentWorkspace?.description ?? "",
    },
  });

  const selectedLogo = watch("logo");

  useEffect(() => {
    reset({
      name: currentWorkspace?.name ?? "",
      description: currentWorkspace?.description ?? "",
    });

    setLogoPreview(null);
  }, [currentWorkspace, reset]);

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

  const handleUpdate = async (data: WorkspaceFormData) => {
    if (!organizationSlug || !workspaceSlug) {
      return;
    }

    const formData = new FormData();

    formData.append("name", data.name.trim());
    formData.append("description", data.description.trim());

    if (data.logo?.[0]) {
      formData.append("logo", data.logo[0]);
    }

    const updatedWorkspace = await updateWorkspace(
      organizationSlug,
      workspaceSlug,
      formData,
    );

    if (!updatedWorkspace) {
      setFeedback({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: "Unable to update the workspace.",
      });

      return;
    }

    reset({
      name: updatedWorkspace.name,
      description: updatedWorkspace.description ?? "",
    });

    setLogoPreview(null);
    setIsEditing(false);

    setFeedback({
      isOpen: true,
      type: "success",
      title: "Workspace Updated",
      message: "Workspace updated successfully.",
    });
  };

  const handleCancelEdit = () => {
    reset({
      name: currentWorkspace?.name ?? "",
      description: currentWorkspace?.description ?? "",
    });

    setLogoPreview(null);
    setIsEditing(false);
  };

  const handleDeleteWorkspace = async () => {
    if (
      !organizationSlug ||
      !workspaceSlug ||
      !currentWorkspace
    ) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${currentWorkspace.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      const deleted = await archiveWorkspace(
        organizationSlug,
        workspaceSlug,
      );

      if (!deleted) {
        setFeedback({
          isOpen: true,
          type: "error",
          title: "Deletion Failed",
          message: "Unable to delete the workspace.",
        });

        return;
      }

      navigate(`/organizations/${organizationSlug}`);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!currentWorkspace) {
    return (
      <div className="text-sm text-gray-500">
        No workspace selected.
      </div>
    );
  }

  const currentLogo =
    logoPreview ?? currentWorkspace.logoUrl;

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Workspace
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Manage your workspace's basic information.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-orange-500 hover:bg-gray-100 hover:text-orange-600"
          >
            <Pencil size={15} />
            Edit
          </button>
        )}
      </div>

      <div className="mt-6">
        {isEditing ? (
          <form
            onSubmit={handleSubmit(handleUpdate)}
            className="space-y-6"
          >
            {/* Workspace Logo */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Workspace Logo
              </label>

              <div className="mt-3 flex items-center gap-4">
                {currentLogo ? (
                  <img
                    src={currentLogo}
                    alt={`${currentWorkspace.name} logo`}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500 text-xl font-semibold text-white">
                    {currentWorkspace.name
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

            <Input
              id="name"
              label="Workspace Name"
              error={errors.name?.message}
              disabled={isLoading || isDeleting}
              {...register("name", {
                required:
                  "Workspace name is required.",
                minLength: {
                  value: 2,
                  message:
                    "Workspace name must be at least 2 characters.",
                },
                maxLength: {
                  value: 50,
                  message:
                    "Workspace name cannot exceed 50 characters.",
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
                rows={4}
                disabled={isLoading || isDeleting}
                {...register("description", {
                  maxLength: {
                    value: 250,
                    message:
                      "Description cannot exceed 250 characters.",
                  },
                })}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:cursor-not-allowed disabled:bg-gray-50"
              />

              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  isDeleting ||
                  !isDirty
                }
                className="w-auto"
              >
                {isLoading
                  ? "Saving..."
                  : "Save Changes"}
              </Button>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isLoading || isDeleting}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteWorkspace}
                disabled={isLoading || isDeleting}
                className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting
                  ? "Deleting..."
                  : "Delete Workspace"}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Workspace Logo */}
            <div>
              <p className="text-xs font-medium text-gray-500">
                Workspace Logo
              </p>

              <div className="mt-2">
                {currentWorkspace.logoUrl ? (
                  <img
                    src={currentWorkspace.logoUrl}
                    alt={`${currentWorkspace.name} logo`}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-500 text-xl font-semibold text-white">
                    {currentWorkspace.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">
                Workspace Name
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {currentWorkspace.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">
                Description
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {currentWorkspace.description ||
                  "No description provided."}
              </p>
            </div>
          </div>
        )}
      </div>

      <FeedbackModal
        {...feedback}
        onClose={() =>
          setFeedback((current) => ({
            ...current,
            isOpen: false,
          }))
        }
      />
    </div>
  );
};

export default WorkspaceSettings;
