/*
  Warnings:

  - You are about to drop the column `irstMonthOnly` on the `Option` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Option" DROP COLUMN "irstMonthOnly",
ADD COLUMN     "firstMonthOnly" BOOLEAN NOT NULL DEFAULT false;
