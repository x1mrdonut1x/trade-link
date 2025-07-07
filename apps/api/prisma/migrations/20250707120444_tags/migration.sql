/*
  Warnings:

  - You are about to drop the column `companyId` on the `tag` table. All the data in the column will be lost.
  - You are about to drop the column `contactId` on the `tag` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `tag` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "tag" DROP CONSTRAINT "tag_companyId_fkey";

-- DropForeignKey
ALTER TABLE "tag" DROP CONSTRAINT "tag_contactId_fkey";

-- DropIndex
DROP INDEX "tag_name_contactId_companyId_createdBy_key";

-- AlterTable
ALTER TABLE "tag" DROP COLUMN "companyId",
DROP COLUMN "contactId",
DROP COLUMN "type";

-- DropEnum
DROP TYPE "tagType";

-- CreateTable
CREATE TABLE "_ContactTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ContactTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CompanyTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CompanyTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ContactTags_B_index" ON "_ContactTags"("B");

-- CreateIndex
CREATE INDEX "_CompanyTags_B_index" ON "_CompanyTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "tag_name_key" ON "tag"("name");

-- AddForeignKey
ALTER TABLE "_ContactTags" ADD CONSTRAINT "_ContactTags_A_fkey" FOREIGN KEY ("A") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactTags" ADD CONSTRAINT "_ContactTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyTags" ADD CONSTRAINT "_CompanyTags_A_fkey" FOREIGN KEY ("A") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CompanyTags" ADD CONSTRAINT "_CompanyTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
