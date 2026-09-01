import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import type { CreateSprintProps } from "@/api/sprint.api";
import { useSprintStore } from "@/store/sprint.store";

interface CreateSprintModalProps {
  isOpen: boolean;
  organizationSlug: string;
  workspaceSlug: string;
  projectSlug: string;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface CreateSprintFormData {
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
}

const CreateSprintModal = ({
  isOpen,
  organizationSlug,
  workspaceSlug,
  projectSlug,
  onClose,
  onSuccess,
  onError,
}: CreateSprintModalProps) => {
  const { createSprint, isCreating } =
    useSprintStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateSprintFormData>({
    defaultValues: {
      name: "",
      goal: "",
      startDate: "",
      endDate: "",
    },
  });

  if (!isOpen) {
    return null;
  }

  const handleCreate = async (
    data: CreateSprintFormData,
  ) => {
    if (
      data.startDate &&
      data.endDate &&
      data.endDate < data.startDate
    ) {
      onError(
        "End date cannot be before start date.",
      );
      return;
    }

    const payload: CreateSprintProps = {
      name: data.name.trim(),
      goal: data.goal.trim() || undefined,
      startDate: data.startDate
        ? new Date(
          `${data.startDate}T00:00:00`,
        ).toISOString()
        : undefined,
      endDate: data.endDate
        ? new Date(
          `${data.endDate}T23:59:59`,
        ).toISOString()
        : undefined,
    };

    const sprint = await createSprint(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      payload,
    );

    if (!sprint) {
      onError(
        "Unable to create sprint. Please try again.",
      );
      return;
    }

    reset();
    onClose();

    onSuccess(
      "Sprint has been created successfully.",
    );
  };

  const handleClose = () => {
    if (isCreating) {
      return;
    }

    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create Sprint
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Create a new sprint for this project.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isCreating}
            className="rounded-lg px-2 py-1 text-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleCreate)}
          className="space-y-5 p-6"
        >
          <Input
            id="name"
            label="Sprint Name"
            placeholder="e.g. Sprint 1"
            error={errors.name?.message}
            {...register("name", {
              required:
                "Sprint name is required.",
              minLength: {
                value: 2,
                message:
                  "Sprint name must be at least 2 characters.",
              },
              maxLength: {
                value: 100,
                message:
                  "Sprint name cannot exceed 100 characters.",
              },
            })}
          />

          <div className="flex flex-col gap-2">
            <label
              htmlFor="goal"
              className="text-sm font-medium text-gray-700"
            >
              Sprint Goal
            </label>

            <textarea
              id="goal"
              rows={3}
              placeholder="What do you want to accomplish?"
              disabled={isCreating}
              {...register("goal", {
                maxLength: {
                  value: 500,
                  message:
                    "Sprint goal cannot exceed 500 characters.",
                },
              })}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
            />

            {errors.goal && (
              <p className="text-sm text-red-500">
                {errors.goal.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="startDate"
              label="Start Date"
              type="date"
              disabled={isCreating}
              error={
                errors.startDate
                  ?.message
              }
              {...register(
                "startDate",
              )}
            />

            <Input
              id="endDate"
              label="End Date"
              type="date"
              disabled={isCreating}
              error={
                errors.endDate
                  ?.message
              }
              {...register(
                "endDate",
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isCreating}
            >
              {isCreating
                ? "Creating..."
                : "Create Sprint"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSprintModal;
