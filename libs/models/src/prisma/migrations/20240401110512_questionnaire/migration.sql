-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_questionnaire_filled" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "training_level" DROP NOT NULL,
ALTER COLUMN "training_type" SET DEFAULT ARRAY[]::TEXT[];
