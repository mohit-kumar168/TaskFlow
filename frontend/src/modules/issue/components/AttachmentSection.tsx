import { useEffect, useRef } from "react";
import {
  File,
  FileImage,
  FileText,
  Paperclip,
  Upload,
} from "lucide-react";
import { useParams } from "react-router-dom";

import Button from "@/components/ui/Button";
import useAttachmentStore from "@/store/attachment.store";


interface AttachmentSectionProps {
  issueId: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.floor(
    Math.log(bytes) / Math.log(1024),
  );

  return `${(
    bytes /
    Math.pow(1024, index)
  ).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) {
    return FileImage;
  }

  if (
    mimeType.includes("pdf") ||
    mimeType.includes("text") ||
    mimeType.includes("document")
  ) {
    return FileText;
  }

  return File;
};

const AttachmentSection = ({
  issueId,
}: AttachmentSectionProps) => {
  const {
    organizationSlug,
    workspaceSlug,
    projectSlug,
  } = useParams<{
    organizationSlug: string;
    workspaceSlug: string;
    projectSlug: string;
  }>();

  const {
    attachments,
    isLoading,
    isUploading,
    error,
    fetchAttachments,
    uploadAttachment,
  } = useAttachmentStore();

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug ||
      !issueId
    ) {
      return;
    }

    fetchAttachments(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
    );
  }, [
    organizationSlug,
    workspaceSlug,
    projectSlug,
    issueId,
    fetchAttachments,
  ]);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (
      !file ||
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug ||
      isUploading
    ) {
      return;
    }

    try {
      await uploadAttachment(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        issueId,
        file,
      );
    } finally {
      event.target.value = "";
    }
  };

  return (
    <section className="border-t border-gray-200 pt-5">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Paperclip
              size={16}
              className="text-gray-500"
            />

            <h3 className="text-sm font-semibold text-gray-900">
              Attachments
            </h3>

            {attachments.length > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                {attachments.length}
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-gray-400">
            Files attached to this issue.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            disabled={isUploading}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={isUploading}
            className="flex shrink-0 items-center gap-2 px-3 py-2 text-xs"
          >
            <Upload size={14} />

            {isUploading
              ? "Uploading..."
              : "Attach"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <p className="text-xs text-red-600">
            {error}
          </p>
        </div>
      )}

      <div className="mt-3 space-y-2">
        {isLoading ? (
          <div className="rounded-lg border border-dashed border-gray-200 px-4 py-5 text-center">
            <p className="text-xs text-gray-400">
              Loading attachments...
            </p>
          </div>
        ) : attachments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-200 px-4 py-5 text-center">
            <Paperclip
              size={18}
              className="mx-auto text-gray-300"
            />

            <p className="mt-2 text-xs text-gray-400">
              No attachments yet.
            </p>
          </div>
        ) : (
          attachments.map((attachment) => {
            const Icon = getFileIcon(
              attachment.mimeType,
            );

            return (
              <a
                key={attachment.id}
                href={attachment.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition hover:border-orange-200 hover:bg-orange-50/30"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <Icon
                    size={17}
                    className="text-gray-500"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {attachment.fileName}
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {formatFileSize(
                      attachment.fileSize,
                    )}
                  </p>
                </div>
              </a>
            );
          })
        )}
      </div>
    </section>
  );
};

export default AttachmentSection;
