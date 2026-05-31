-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED', 'CANCELLATION_REQUESTED', 'MODIFICATION_REQUESTED');

-- CreateTable
CREATE TABLE "branches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "reservationInbox" TEXT NOT NULL,
    "reservationRoutingLabel" TEXT NOT NULL,
    "diaryPlaceName" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "confirmationNumber" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "customerId" TEXT,
    "guests" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "selectedTime" TEXT NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
    "preferences" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "source" TEXT NOT NULL DEFAULT 'website',
    "routingInbox" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_phone_key" ON "customers"("email", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_confirmationNumber_key" ON "reservations"("confirmationNumber");

-- CreateIndex
CREATE INDEX "reservations_branchId_status_date_idx" ON "reservations"("branchId", "status", "date");

-- CreateIndex
CREATE INDEX "reservations_confirmationNumber_idx" ON "reservations"("confirmationNumber");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
