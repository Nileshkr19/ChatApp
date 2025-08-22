/*
  Warnings:

  - You are about to drop the column `isPrivate` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Room" DROP COLUMN "isPrivate",
ADD COLUMN     "roomType" "public"."RoomVisibility" NOT NULL DEFAULT 'PUBLIC';
