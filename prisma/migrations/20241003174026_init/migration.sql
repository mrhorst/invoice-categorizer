/*
  Warnings:

  - You are about to drop the column `authorId` on the `Invoice` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Invoice" (
    "invoiceNum" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" TEXT NOT NULL,
    "total" TEXT NOT NULL,
    "vendor" TEXT NOT NULL
);
INSERT INTO "new_Invoice" ("createdAt", "date", "invoiceNum", "total", "vendor") SELECT "createdAt", "date", "invoiceNum", "total", "vendor" FROM "Invoice";
DROP TABLE "Invoice";
ALTER TABLE "new_Invoice" RENAME TO "Invoice";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
