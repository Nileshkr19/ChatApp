/*
  Warnings:

  - You are about to drop the column `hashedPassword` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiresAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,roomId]` on the table `RoomMember` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Room" DROP COLUMN "hashedPassword",
ALTER COLUMN "roomCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."RoomMember" ALTER COLUMN "role" SET DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "otp",
DROP COLUMN "otpExpiresAt";

-- CreateIndex
CREATE UNIQUE INDEX "RoomMember_userId_roomId_key" ON "public"."RoomMember"("userId", "roomId");

-- AddForeignKey
ALTER TABLE "public"."RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
