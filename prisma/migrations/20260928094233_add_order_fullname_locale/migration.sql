-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "fullName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'tr';
