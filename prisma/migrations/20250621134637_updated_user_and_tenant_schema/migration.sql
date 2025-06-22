/*
  Warnings:

  - You are about to drop the column `numberOfRooms` on the `LandLordProfile` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `LandLordProfile` table. All the data in the column will be lost.
  - You are about to drop the column `typeOfHouse` on the `LandLordProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `LandLordProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `TenantProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `LandLordProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LandLordProfile" DROP COLUMN "numberOfRooms",
DROP COLUMN "street",
DROP COLUMN "typeOfHouse",
ADD COLUMN     "address" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LandLordProfile_userId_key" ON "LandLordProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TenantProfile_userId_key" ON "TenantProfile"("userId");
