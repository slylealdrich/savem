/*
  Warnings:

  - You are about to drop the column `amount` on the `Entry` table. All the data in the column will be lost.
  - Added the required column `cents` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dollars` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "dollars" INTEGER NOT NULL,
    "cents" INTEGER NOT NULL,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_Entry" ("date", "id") SELECT "date", "id" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
