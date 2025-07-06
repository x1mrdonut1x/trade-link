/*
 Warnings:
 
 - You are about to drop the column `text` on the `note` table. All the data in the column will be lost.
 - You are about to drop the column `userId` on the `note` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[email]` on the table `company` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `createdBy` to the `note` table without a default value. This is not possible if the table is not empty.
 - Added the required column `title` to the `note` table without a default value. This is not possible if the table is not empty.
 - Added the required column `updatedAt` to the `note` table without a default value. This is not possible if the table is not empty.
 
 */
-- DropForeignKey
ALTER TABLE
  "note" DROP CONSTRAINT "note_userId_fkey";

-- AlterTable
ALTER TABLE
  "note" DROP COLUMN "text",
  DROP COLUMN "userId",
ADD
  COLUMN "companyId" INTEGER,
ADD
  COLUMN "contactId" INTEGER,
ADD
  COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD
  COLUMN "createdBy" INTEGER NOT NULL,
ADD
  COLUMN "description" TEXT,
ADD
  COLUMN "title" TEXT NOT NULL,
ADD
  COLUMN "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE
  "note"
ADD
  CONSTRAINT "note_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "note"
ADD
  CONSTRAINT "note_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
  "note"
ADD
  CONSTRAINT "note_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;