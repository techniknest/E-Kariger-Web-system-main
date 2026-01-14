/*
  Warnings:

  - A unique constraint covering the columns `[cnic]` on the table `vendor_profiles` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vendor_profiles" ADD COLUMN     "business_phone" TEXT,
ADD COLUMN     "cnic" TEXT,
ADD COLUMN     "experience_years" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "vendor_profiles_cnic_key" ON "vendor_profiles"("cnic");
