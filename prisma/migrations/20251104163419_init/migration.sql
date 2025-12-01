-- CreateTable
CREATE TABLE "customers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "businessName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "vatNumber" TEXT NOT NULL,
    "address" TEXT,
    "zipCode" TEXT,
    "city" TEXT,
    "createdAt" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "products" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "measure" TEXT,
    "price" REAL NOT NULL,
    "createdAt" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "company_profiles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "profileName" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "vatNumber" TEXT NOT NULL,
    "address" TEXT,
    "zipCode" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "smtpHost" TEXT,
    "smtpPort" INTEGER DEFAULT 587,
    "smtpSecure" INTEGER DEFAULT 0,
    "smtpUser" TEXT,
    "smtpPassword" TEXT,
    "smtpFromEmail" TEXT,
    "smtpFromName" TEXT,
    "isDefault" INTEGER NOT NULL DEFAULT 0,
    "createdAt" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "number" TEXT NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 0,
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

-- CreateTable
CREATE TABLE "quote_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quoteId" INTEGER NOT NULL,
    "ordering" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER,
    "code" TEXT NOT NULL,
    "measure" TEXT,
    "description" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "unitPrice" REAL NOT NULL,
    "lineTotal" REAL NOT NULL,
    "discount1" REAL DEFAULT 0,
    "discount2" REAL DEFAULT 0,
    "discount3" REAL DEFAULT 0,
    "netUnitPrice" REAL NOT NULL,
    "netLineTotal" REAL NOT NULL,
    "vatRate" REAL DEFAULT 22.0,
    "vatAmount" REAL NOT NULL,
    "createdAt" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "quote_items_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "quotes" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quote_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "company_profiles_profileName_key" ON "company_profiles"("profileName");

-- CreateIndex
CREATE UNIQUE INDEX "quotes_number_revision_key" ON "quotes"("number", "revision");
