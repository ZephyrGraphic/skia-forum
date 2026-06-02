-- AlterTable
ALTER TABLE "User" ADD COLUMN     "badge" TEXT,
ADD COLUMN     "bannedAt" TIMESTAMP(3),
ADD COLUMN     "bannedReason" TEXT;

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_bannedAt_idx" ON "User"("bannedAt");
