/*
  Warnings:

  - Added the required column `tenantId` to the `eventSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "eventSchedule" ADD COLUMN     "tenantId" INTEGER NOT NULL;
