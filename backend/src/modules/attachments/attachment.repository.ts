import prisma from "@/prisma/client";

export const createAttachment = async (
  issueId: string,
  uploadedById: string,
  fileName: string,
  fileUrl: string,
  fileSize: number,
  mimeType: string,
) => {
  return await prisma.attachment.create({
    data: {
      issueId,
      uploadedById,
      fileName,
      fileUrl,
      fileSize,
      mimeType,
    },
    include: {
      uploadedBy: {
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

export const fetchAttachmentsByIssueId = async (
  issueId: string,
) => {
  return await prisma.attachment.findMany({
    where: {
      issueId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      uploadedBy: {
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

export const findAttachmentById = async (
  attachmentId: string,
  issueId: string,
) => {
  return await prisma.attachment.findFirst({
    where: {
      id: attachmentId,
      issueId,
    },
  });
};

export const deleteAttachment = async (
  attachmentId: string,
) => {
  return await prisma.attachment.delete({
    where: {
      id: attachmentId,
    },
  });
};
