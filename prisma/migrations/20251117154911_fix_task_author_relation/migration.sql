/*
  Warnings:

  - You are about to drop the column `groupId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `_ChildGroups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `teacher_groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_groupId_fkey";

-- DropForeignKey
ALTER TABLE "_ChildGroups" DROP CONSTRAINT "_ChildGroups_A_fkey";

-- DropForeignKey
ALTER TABLE "_ChildGroups" DROP CONSTRAINT "_ChildGroups_B_fkey";

-- DropForeignKey
ALTER TABLE "teacher_groups" DROP CONSTRAINT "teacher_groups_teacherId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "groupId",
ADD COLUMN     "teacherId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "teacherId" TEXT;

-- DropTable
DROP TABLE "_ChildGroups";

-- DropTable
DROP TABLE "teacher_groups";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
