/*
  Warnings:

  - Added the required column `firstName` to the `TenantProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `TenantProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otherName` to the `TenantProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TenantProfile" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "otherName" TEXT NOT NULL;
