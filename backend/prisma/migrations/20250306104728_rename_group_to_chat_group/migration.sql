/*
  Warnings:

  - You are about to drop the column `groupId` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserGroups` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `chatGroupId` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserGroups" DROP CONSTRAINT "_UserGroups_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserGroups" DROP CONSTRAINT "_UserGroups_B_fkey";

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "groupId",
ADD COLUMN     "chatGroupId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Group";

-- DropTable
DROP TABLE "UserGroup";

-- DropTable
DROP TABLE "_UserGroups";

-- CreateTable
CREATE TABLE "ChatGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChatGroup" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "chatGroupId" INTEGER NOT NULL,

    CONSTRAINT "UserChatGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserChatGroups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_UserChatGroups_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatGroup_name_key" ON "ChatGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserChatGroup_userId_chatGroupId_key" ON "UserChatGroup"("userId", "chatGroupId");

-- CreateIndex
CREATE INDEX "_UserChatGroups_B_index" ON "_UserChatGroups"("B");

-- AddForeignKey
ALTER TABLE "UserChatGroup" ADD CONSTRAINT "UserChatGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChatGroup" ADD CONSTRAINT "UserChatGroup_chatGroupId_fkey" FOREIGN KEY ("chatGroupId") REFERENCES "ChatGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_chatGroupId_fkey" FOREIGN KEY ("chatGroupId") REFERENCES "ChatGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserChatGroups" ADD CONSTRAINT "_UserChatGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserChatGroups" ADD CONSTRAINT "_UserChatGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
