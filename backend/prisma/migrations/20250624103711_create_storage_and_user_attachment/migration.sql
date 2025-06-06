-- CreateTable
CREATE TABLE "storage_blobs" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "contentType" TEXT,
    "metadata" JSONB,
    "byteSize" BIGINT NOT NULL,
    "checksum" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serviceName" TEXT NOT NULL,

    CONSTRAINT "storage_blobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "storage_attachments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "recordType" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "blobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "storage_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_attachments" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "mediaFileName" TEXT NOT NULL,
    "mediaContentType" TEXT NOT NULL,
    "mediaFileSize" BIGINT NOT NULL,
    "mediaFingerprint" TEXT,
    "mediaUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "uploadedById" TEXT NOT NULL,

    CONSTRAINT "user_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "storage_blobs_key_key" ON "storage_blobs"("key");

-- CreateIndex
CREATE INDEX "storage_blobs_key_idx" ON "storage_blobs"("key");

-- CreateIndex
CREATE INDEX "storage_attachments_blobId_idx" ON "storage_attachments"("blobId");

-- CreateIndex
CREATE INDEX "storage_attachments_recordType_recordId_idx" ON "storage_attachments"("recordType", "recordId");

-- CreateIndex
CREATE UNIQUE INDEX "storage_attachments_name_recordType_recordId_key" ON "storage_attachments"("name", "recordType", "recordId");

-- CreateIndex
CREATE INDEX "user_attachments_uploadedById_idx" ON "user_attachments"("uploadedById");

-- AddForeignKey
ALTER TABLE "storage_attachments" ADD CONSTRAINT "storage_attachments_blobId_fkey" FOREIGN KEY ("blobId") REFERENCES "storage_blobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_attachments" ADD CONSTRAINT "user_attachments_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
