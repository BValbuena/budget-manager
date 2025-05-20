/*
  Warnings:

  - Added the required column `clientEmail` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientName` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clientPhone` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "clientEmail" TEXT NOT NULL,
ADD COLUMN     "clientName" TEXT NOT NULL,
ADD COLUMN     "clientPhone" TEXT NOT NULL;
