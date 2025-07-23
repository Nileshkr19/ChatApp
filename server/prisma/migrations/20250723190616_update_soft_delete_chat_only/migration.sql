/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isDeleted";
