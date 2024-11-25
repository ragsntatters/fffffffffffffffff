import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import sharp from 'sharp'
import { config } from '../config'

const s3 = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  }
})

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function uploadMedia(file: Buffer, mimeType: string, key: string) {
  if (!ALLOWED_TYPES.includes(mimeType)) {
    throw new Error('Unsupported file type')
  }

  if (file.length > MAX_FILE_SIZE) {
    throw new Error('File too large')
  }

  let processedFile = file
  let metadata = {}

  // Process images
  if (mimeType.startsWith('image/')) {
    const image = sharp(file)
    const info = await image.metadata()

    // Resize if too large
    if (info.width && info.width > 2048) {
      processedFile = await image.resize(2048, null, {
        withoutEnlargement: true,
        fit: 'inside'
      }).toBuffer()
    }

    // Convert to WebP for better compression
    if (mimeType !== 'image/webp') {
      processedFile = await sharp(processedFile).webp().toBuffer()
      mimeType = 'image/webp'
    }

    metadata = {
      width: info.width,
      height: info.height,
      format: info.format
    }
  }

  await s3.send(new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
    Body: processedFile,
    ContentType: mimeType,
    Metadata: metadata as Record<string, string>
  }))

  return {
    key,
    url: `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`,
    size: processedFile.length,
    ...metadata
  }
}

export async function deleteMedia(key: string) {
  await s3.send(new DeleteObjectCommand({
    Bucket: config.aws.bucket,
    Key: key
  }))
}

export async function getSignedUploadUrl(key: string, contentType: string) {
  if (!ALLOWED_TYPES.includes(contentType)) {
    throw new Error('Unsupported file type')
  }

  const command = new PutObjectCommand({
    Bucket: config.aws.bucket,
    Key: key,
    ContentType: contentType
  })

  return getSignedUrl(s3, command, { expiresIn: 3600 })