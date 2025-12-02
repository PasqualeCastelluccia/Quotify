-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_quotes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" INTEGER NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "date" TEXT NOT NULL,
    "customerId" INTEGER,
    "customerBusinessName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "customerVatNumber" TEXT,
    "customerAddress" TEXT,
    "customerZipCode" TEXT,
    "customerCity" TEXT,
    "subtotal" REAL NOT NULL,
    "totalVat" REAL NOT NULL,
    "total" REAL NOT NULL,
    "notes" TEXT,
    "metadata" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "companyProfileId" INTEGER,
    "createdAt" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "quotes_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "quotes_companyProfileId_fkey" FOREIGN KEY ("companyProfileId") REFERENCES "company_profiles" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_quotes" ("companyProfileId", "createdAt", "customerAddress", "customerBusinessName", "customerCity", "customerEmail", "customerId", "customerVatNumber", "customerZipCode", "date", "id", "metadata", "notes", "number", "revision", "status", "subtotal", "total", "totalVat", "updatedAt") SELECT "companyProfileId", "createdAt", "customerAddress", "customerBusinessName", "customerCity", "customerEmail", "customerId", "customerVatNumber", "customerZipCode", "date", "id", "metadata", "notes", "number", "revision", "status", "subtotal", "total", "totalVat", "updatedAt" FROM "quotes";
DROP TABLE "quotes";
ALTER TABLE "new_quotes" RENAME TO "quotes";
CREATE UNIQUE INDEX "quotes_number_revision_key" ON "quotes"("number", "revision");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
