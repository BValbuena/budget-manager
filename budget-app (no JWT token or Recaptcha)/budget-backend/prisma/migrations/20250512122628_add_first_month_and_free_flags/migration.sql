-- AlterTable
ALTER TABLE "Option" ADD COLUMN     "irstMonthOnly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFree" BOOLEAN NOT NULL DEFAULT false;
