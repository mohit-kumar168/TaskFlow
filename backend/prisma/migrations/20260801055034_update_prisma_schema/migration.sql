/*
  Warnings:

  - You are about to drop the column `deletedAt` on the `issues` table. All the data in the column will be lost.
  - You are about to drop the `activities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `attachments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `issue_labels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `labels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workspace_invites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_actorId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_issueId_fkey";

-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_projectId_fkey";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_issueId_fkey";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_uploaderId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_authorId_fkey";

-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_issueId_fkey";

-- DropForeignKey
ALTER TABLE "issue_labels" DROP CONSTRAINT "issue_labels_issueId_fkey";

-- DropForeignKey
ALTER TABLE "issue_labels" DROP CONSTRAINT "issue_labels_labelId_fkey";

-- DropForeignKey
ALTER TABLE "labels" DROP CONSTRAINT "labels_projectId_fkey";

-- DropForeignKey
ALTER TABLE "labels" DROP CONSTRAINT "labels_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- DropForeignKey
ALTER TABLE "workspace_invites" DROP CONSTRAINT "workspace_invites_workspaceId_fkey";

-- AlterTable
ALTER TABLE "issues" DROP COLUMN "deletedAt";

-- DropTable
DROP TABLE "activities";

-- DropTable
DROP TABLE "attachments";

-- DropTable
DROP TABLE "comments";

-- DropTable
DROP TABLE "issue_labels";

-- DropTable
DROP TABLE "labels";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "workspace_invites";
