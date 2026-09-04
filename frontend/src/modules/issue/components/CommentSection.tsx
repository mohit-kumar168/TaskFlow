import { useEffect, useState } from "react";
import {
  Pencil,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { useParams } from "react-router-dom";

import Button from "@/components/ui/Button";

import {
  type CommentProps,
  type CommentContentProps,
} from "@/api/comment.api";
import { useCommentStore } from "@/store/comment.store";
import { useAuthStore } from "@/store/auth.store";

interface CommentSectionProps {
  issueId: string;
}

const CommentSection = ({
  issueId,
}: CommentSectionProps) => {
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
    comments,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    fetchComments,
    addComment,
    editComment,
    removeComment,
  } = useCommentStore();

  const { user } = useAuthStore();

  const [content, setContent] = useState("");
  const [editingCommentId, setEditingCommentId] =
    useState<string | null>(null);
  const [editingContent, setEditingContent] =
    useState("");

  useEffect(() => {
    if (
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug ||
      !issueId
    ) {
      return;
    }

    fetchComments(
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
    fetchComments,
  ]);

  const handleCreateComment = async () => {
    const trimmedContent = content.trim();

    if (
      !trimmedContent ||
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug ||
      isCreating
    ) {
      return;
    }

    const data: CommentContentProps = {
      content: trimmedContent,
    };

    const comment = await addComment(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
      data,
    );

    if (comment) {
      setContent("");
    }
  };

  const handleEditComment = async (
    commentId: string,
  ) => {
    const trimmedContent =
      editingContent.trim();

    if (
      !trimmedContent ||
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug ||
      isUpdating
    ) {
      return;
    }

    const updatedComment =
      await editComment(
        organizationSlug,
        workspaceSlug,
        projectSlug,
        issueId,
        commentId,
        {
          content: trimmedContent,
        },
      );

    if (updatedComment) {
      setEditingCommentId(null);
      setEditingContent("");
    }
  };

  const handleDeleteComment = async (
    commentId: string,
  ) => {
    if (
      !organizationSlug ||
      !workspaceSlug ||
      !projectSlug ||
      isDeleting
    ) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?",
    );

    if (!confirmed) {
      return;
    }

    await removeComment(
      organizationSlug,
      workspaceSlug,
      projectSlug,
      issueId,
      commentId,
    );
  };

  const startEditing = (
    comment: CommentProps,
  ) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const formatCommentDate = (
    date: string,
  ) => {
    return new Date(date).toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Comments
            </h3>

            <p className="mt-1 text-xs text-gray-400">
              Discussion about this issue
            </p>
          </div>

          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
            {comments.length}
          </span>
        </div>
      </div>

      {/* Comments */}
      <div className="min-h-0 flex-1 overflow-y-auto py-4 pr-1">
        {isLoading ? (
          <div className="py-10 text-center">
            <p className="text-sm text-gray-400">
              Loading comments...
            </p>
          </div>
        ) : comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center">
            <p className="text-sm text-gray-500">
              No comments yet.
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Start the discussion below.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {comments.map((comment) => {
              const isEditing =
                editingCommentId ===
                comment.id;

              const isAuthor =
                user?.id === comment.author.id;

              return (
                <div
                  key={comment.id}
                  className="group rounded-xl border border-gray-200 bg-white px-4 py-2 transition hover:border-gray-300"
                >
                  <div className="flex items-start gap-3">
                    {comment.author.avatarUrl ? (
                      <img
                        src={
                          comment.author
                            .avatarUrl
                        }
                        alt={
                          comment.author.name
                        }
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-semibold text-orange-600">
                        {comment.author.name
                          ?.charAt(0)
                          .toUpperCase() ||
                          "U"}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {comment.author.name}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-400">
                            {formatCommentDate(
                              comment.createdAt,
                            )}
                          </p>
                        </div>

                        {isAuthor &&
                          !isEditing && (
                            <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() =>
                                  startEditing(
                                    comment,
                                  )
                                }
                                disabled={
                                  isUpdating ||
                                  isDeleting
                                }
                                className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                                title="Edit comment"
                              >
                                <Pencil
                                  size={13}
                                />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteComment(
                                    comment.id,
                                  )
                                }
                                disabled={
                                  isUpdating ||
                                  isDeleting
                                }
                                className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                                title="Delete comment"
                              >
                                <Trash2
                                  size={13}
                                />
                              </button>
                            </div>
                          )}
                      </div>

                      {isEditing ? (
                        <div className="mt-3">
                          <textarea
                            value={
                              editingContent
                            }
                            onChange={(
                              event,
                            ) =>
                              setEditingContent(
                                event.target
                                  .value,
                              )
                            }
                            maxLength={1000}
                            rows={3}
                            autoFocus
                            disabled={
                              isUpdating
                            }
                            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
                          />

                          <div className="mt-2 flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={
                                cancelEditing
                              }
                              disabled={
                                isUpdating
                              }
                              className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                            >
                              <X
                                size={13}
                              />
                              Cancel
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleEditComment(
                                  comment.id,
                                )
                              }
                              disabled={
                                isUpdating ||
                                !editingContent.trim()
                              }
                              className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isUpdating
                                ? "Saving..."
                                : "Save"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-gray-200 pt-3">
        <div className="flex items-end gap-2">
          <textarea
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            maxLength={1000}
            rows={2}
            placeholder="Write a comment..."
            disabled={isCreating}
            className="min-h-12 max-h-32 flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:bg-gray-50"
          />

          <Button
            type="button"
            variant="outline"
            onClick={handleCreateComment}
            disabled={
              isCreating ||
              !content.trim()
            }
            className="flex h-11 shrink-0 items-center gap-1.5 px-3"
          >
            <Send size={14} />

            <span className="hidden sm:inline">
              {isCreating
                ? "Sending..."
                : "Send"}
            </span>
          </Button>
        </div>

        <p className="mt-1 text-right text-[11px] text-gray-400">
          {content.length}/1000
        </p>
      </div>
    </div>
  );
};

export default CommentSection;
