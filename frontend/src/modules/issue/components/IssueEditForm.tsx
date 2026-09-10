import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

import type {
  IssueType,
  IssuePriority,
} from "@/api/issue.api";
import type { SprintProps } from "@/api/sprint.api";

import Button from "@/modules/common/components/ui/Button";
import Input from "@/modules/common/components/ui/Input";

export interface IssueDetailsFormData {
  title: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  dueDate: string;
  email: string;
  sprintId: string;
}

interface IssueEditFormProps {
  issueKey: string;
  register: UseFormRegister<IssueDetailsFormData>;
  handleSubmit: UseFormHandleSubmit<IssueDetailsFormData>;
  errors: FieldErrors<IssueDetailsFormData>;
  onSubmit: (data: IssueDetailsFormData) => Promise<void>;
  onCancel: () => void;
  sprints: SprintProps[];
  isSprintsLoading: boolean;
  isDisabled: boolean;
  isUpdating: boolean;
}

const IssueEditForm = ({
  issueKey,
  register,
  handleSubmit,
  errors,
  onSubmit,
  onCancel,
  sprints,
  isSprintsLoading,
  isDisabled,
  isUpdating,
}: IssueEditFormProps) => {
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
          Editing Issue
        </p>
        <p className="mt-1 text-sm font-medium text-gray-900">
          {issueKey}
        </p>
      </div>

      <Input
        id="title"
        label="Title"
        error={errors.title?.message}
        {...register("title", {
          required: "Issue title is required.",
          minLength: {
            value: 2,
            message: "Issue title must be at least 2 characters.",
          },
        })}
        disabled={isDisabled}
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
          rows={6}
          {...register("description")}
          disabled={isDisabled}
          className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
          placeholder="Describe the issue..."
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          id="type"
          label="Type"
          register={register("type")}
          disabled={isDisabled}
        >
          <option value="TASK">Task</option>
          <option value="BUG">Bug</option>
          <option value="STORY">Story</option>
          <option value="EPIC">Epic</option>
        </SelectField>

        <SelectField
          id="priority"
          label="Priority"
          register={register("priority")}
          disabled={isDisabled}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </SelectField>
      </div>

      <SelectField
        id="sprintId"
        label="Sprint"
        register={register("sprintId")}
        disabled={isDisabled || isSprintsLoading}
      >
        <option value="">
          {isSprintsLoading ? "Loading sprints..." : "No Sprint"}
        </option>
        {sprints.map((sprint) => (
          <option key={sprint.id} value={sprint.id}>
            {sprint.name}
          </option>
        ))}
      </SelectField>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="dueDate"
          className="text-sm font-medium text-gray-700"
        >
          Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          {...register("dueDate")}
          disabled={isDisabled}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
        />
      </div>

      <Input
        id="email"
        type="email"
        label="Assignee Email"
        placeholder="member@example.com"
        error={errors.email?.message}
        {...register("email")}
        disabled={isDisabled}
      />

      <div className="flex flex-col gap-2 border-t border-gray-200 pt-5 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isDisabled}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="outline"
          disabled={isDisabled}
          className="flex-1"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

interface SelectFieldProps {
  id: string;
  label: string;
  register: ReturnType<UseFormRegister<IssueDetailsFormData>>;
  disabled: boolean;
  children: React.ReactNode;
}

const SelectField = ({
  id,
  label,
  register,
  disabled,
  children,
}: SelectFieldProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        id={id}
        {...register}
        disabled={disabled}
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
      >
        {children}
      </select>
    </div>
  );
};

export default IssueEditForm;