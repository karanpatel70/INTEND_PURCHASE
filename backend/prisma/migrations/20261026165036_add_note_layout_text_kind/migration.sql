-- AlterTable
ALTER TABLE "FormTemplate" ADD COLUMN     "note" TEXT,
ADD COLUMN     "printLayout" TEXT;

-- AlterTable
ALTER TABLE "IndentHistory" ADD COLUMN     "kind" TEXT,
ADD COLUMN     "text" TEXT;
