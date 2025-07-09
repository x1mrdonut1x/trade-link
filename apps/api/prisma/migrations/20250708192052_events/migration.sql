-- AlterTable
ALTER TABLE "note" ADD COLUMN     "eventId" INTEGER;

-- AlterTable
ALTER TABLE "task" ADD COLUMN     "eventId" INTEGER;

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "location" TEXT NOT NULL,
    "venue" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Planning',
    "rating" SMALLINT,
    "tenantId" INTEGER NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventSchedule" (
    "id" SERIAL NOT NULL,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "location" TEXT,
    "eventId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_eventContacts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_eventContacts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_eventScheduleContacts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_eventScheduleContacts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_eventCompanies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_eventCompanies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_eventTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_eventTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_id_key" ON "event"("id");

-- CreateIndex
CREATE UNIQUE INDEX "eventSchedule_id_key" ON "eventSchedule"("id");

-- CreateIndex
CREATE INDEX "_eventContacts_B_index" ON "_eventContacts"("B");

-- CreateIndex
CREATE INDEX "_eventScheduleContacts_B_index" ON "_eventScheduleContacts"("B");

-- CreateIndex
CREATE INDEX "_eventCompanies_B_index" ON "_eventCompanies"("B");

-- CreateIndex
CREATE INDEX "_eventTags_B_index" ON "_eventTags"("B");

-- AddForeignKey
ALTER TABLE "note" ADD CONSTRAINT "note_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventSchedule" ADD CONSTRAINT "eventSchedule_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_eventContacts" ADD CONSTRAINT "_eventContacts_A_fkey" FOREIGN KEY ("A") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_eventContacts" ADD CONSTRAINT "_eventContacts_B_fkey" FOREIGN KEY ("B") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_eventScheduleContacts" ADD CONSTRAINT "_eventScheduleContacts_A_fkey" FOREIGN KEY ("A") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_eventScheduleContacts" ADD CONSTRAINT "_eventScheduleContacts_B_fkey" FOREIGN KEY ("B") REFERENCES "eventSchedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_eventCompanies" ADD CONSTRAINT "_eventCompanies_A_fkey" FOREIGN KEY ("A") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_eventCompanies" ADD CONSTRAINT "_eventCompanies_B_fkey" FOREIGN KEY ("B") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_eventTags" ADD CONSTRAINT "_eventTags_A_fkey" FOREIGN KEY ("A") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_eventTags" ADD CONSTRAINT "_eventTags_B_fkey" FOREIGN KEY ("B") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
