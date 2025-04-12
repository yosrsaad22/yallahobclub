-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "backColor" TEXT,
ADD COLUMN     "backImage" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "image" TEXT;
