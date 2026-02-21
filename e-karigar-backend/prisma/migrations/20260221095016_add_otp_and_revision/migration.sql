/*
  Warnings:

  - The values [CREATED,PENDING_APPROVAL,EXPIRED] on the enum `BookingStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `expires_at` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `address` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problem_description` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduled_date` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'WAITING_APPROVAL', 'COMPLETED', 'CANCELLED');
ALTER TABLE "bookings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TABLE "booking_status_logs" ALTER COLUMN "old_status" TYPE "BookingStatus_new" USING ("old_status"::text::"BookingStatus_new");
ALTER TABLE "booking_status_logs" ALTER COLUMN "new_status" TYPE "BookingStatus_new" USING ("new_status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "BookingStatus_old";
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "expires_at",
DROP COLUMN "location",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "final_price" DECIMAL(10,2),
ADD COLUMN     "is_price_revised" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "problem_description" TEXT NOT NULL,
ADD COLUMN     "revision_reason" TEXT,
ADD COLUMN     "scheduled_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "start_otp" TEXT,
ADD COLUMN     "total_price" DECIMAL(10,2) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
