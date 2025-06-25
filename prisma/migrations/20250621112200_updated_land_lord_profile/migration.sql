/*
  Warnings:

  - The values [calls,chat,both] on the enum `Preference` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `firstName` to the `LandLordProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `LandLordProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `LandLordProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otherName` to the `LandLordProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Preference_new" AS ENUM ('CALLS', 'CHATS', 'BOTH');
ALTER TABLE "LandLordProfile" ALTER COLUMN "preference" DROP DEFAULT;
ALTER TABLE "LandLordProfile" ALTER COLUMN "preference" TYPE "Preference_new" USING ("preference"::text::"Preference_new");
ALTER TYPE "Preference" RENAME TO "Preference_old";
ALTER TYPE "Preference_new" RENAME TO "Preference";
DROP TYPE "Preference_old";
ALTER TABLE "LandLordProfile" ALTER COLUMN "preference" SET DEFAULT 'CALLS';
COMMIT;

-- AlterTable
ALTER TABLE "LandLordProfile" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "otherName" TEXT NOT NULL,
ALTER COLUMN "preference" SET DEFAULT 'CALLS';
