/*
  Warnings:

  - Added the required column `pricePerHour` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Plan" ADD COLUMN     "pricePerHour" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "hourlyRate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
