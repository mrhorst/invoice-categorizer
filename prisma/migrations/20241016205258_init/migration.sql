/*
  Warnings:

  - Added the required column `taxable` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "invoiceId" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "itemQty" DECIMAL NOT NULL,
    "extendedPrice" DECIMAL NOT NULL,
    "taxRate" DECIMAL NOT NULL,
    "taxable" BOOLEAN NOT NULL,
    "categoryId" TEXT NOT NULL,
    CONSTRAINT "Item_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice" ("invoiceNumber") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("categoryId", "description", "extendedPrice", "id", "invoiceId", "itemCode", "itemQty", "price", "taxRate") SELECT "categoryId", "description", "extendedPrice", "id", "invoiceId", "itemCode", "itemQty", "price", "taxRate" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
