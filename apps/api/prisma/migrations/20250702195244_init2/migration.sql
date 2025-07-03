/*
  Warnings:

  - You are about to drop the column `contactData` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `contactData` on the `contact` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "company" DROP COLUMN "contactData",
DROP COLUMN "phone",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "extraInfo" JSONB,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "phonePrefix" TEXT,
ADD COLUMN     "postCode" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "contact" DROP COLUMN "contactData",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "phonePrefix" TEXT,
ADD COLUMN     "postCode" TEXT;
