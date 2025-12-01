-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_quote_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quoteId" INTEGER NOT NULL,
    "ordering" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER,
    "code" TEXT NOT NULL,
    "measure" TEXT,
    "description" TEXT,
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
INSERT INTO "new_quote_items" ("code", "createdAt", "description", "discount1", "discount2", "discount3", "id", "lineTotal", "measure", "netLineTotal", "netUnitPrice", "ordering", "productId", "quantity", "quoteId", "unit", "unitPrice", "updatedAt", "vatAmount", "vatRate") SELECT "code", "createdAt", "description", "discount1", "discount2", "discount3", "id", "lineTotal", "measure", "netLineTotal", "netUnitPrice", "ordering", "productId", "quantity", "quoteId", "unit", "unitPrice", "updatedAt", "vatAmount", "vatRate" FROM "quote_items";
DROP TABLE "quote_items";
ALTER TABLE "new_quote_items" RENAME TO "quote_items";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
