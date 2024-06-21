/*
  Warnings:

  - You are about to drop the column `dollars` on the `Entry` table. All the data in the column will be lost.
  - You are about to alter the column `cents` on the `Entry` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - Added the required column `description` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Entry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "description" TEXT NOT NULL,
    "cents" BIGINT NOT NULL,
    "date" DATETIME NOT NULL
);
INSERT INTO "new_Entry" ("cents", "date", "id") SELECT "cents", "date", "id" FROM "Entry";
DROP TABLE "Entry";
ALTER TABLE "new_Entry" RENAME TO "Entry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
