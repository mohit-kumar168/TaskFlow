import prisma from "../../prisma/client";
import type {
  CommentInput,
} from "./comment.types";

export const createComment = async (
  issueId: string,
  authorId: string,
  data: CommentInput,
) => {
  return await prisma.comment.create({
    data: {
      issueId,
      authorId,
      content: data.content,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },

  });
};

export const fetchAllComments = async (
  issueId: string,
) => {
  return await prisma.comment.findMany({
    where: {
      issueId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
};

export const fetchCommentById = async (
  issueId: string,
  commentId: string,
) => {
  return await prisma.comment.findFirst({
    where: {
      id: commentId,
      issueId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  });
};

export const updateComment = async (
  commentId: string,
  data: CommentInput,
) => {
  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      content: data.content,
    },
  });
};

export const deleteComment = async (
  commentId: string,
) => {
  return await prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};
