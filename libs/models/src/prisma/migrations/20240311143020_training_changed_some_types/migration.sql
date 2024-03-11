/*
  Warnings:

  - Changed the type of `calories_target` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `calories_per_day` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "trainings" ALTER COLUMN "duration" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "calories_target",
ADD COLUMN     "calories_target" INTEGER NOT NULL,
DROP COLUMN "calories_per_day",
ADD COLUMN     "calories_per_day" INTEGER NOT NULL;
