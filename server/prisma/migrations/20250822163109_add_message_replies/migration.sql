/*
  Warnings:

  - You are about to drop the `RoomMessageReply` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."RoomMessageReply" DROP CONSTRAINT "RoomMessageReply_roomMessageId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RoomMessageReply" DROP CONSTRAINT "RoomMessageReply_senderId_fkey";

-- AlterTable
ALTER TABLE "public"."RoomMessage" ADD COLUMN     "parentMessageId" TEXT;

-- DropTable
DROP TABLE "public"."RoomMessageReply";

-- AddForeignKey
ALTER TABLE "public"."RoomMessage" ADD CONSTRAINT "RoomMessage_parentMessageId_fkey" FOREIGN KEY ("parentMessageId") REFERENCES "public"."RoomMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
