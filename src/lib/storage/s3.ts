import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { config } from '../../config'
import { logger } from '../../utils/logger'
import { ApiError } from '../../utils/errors'

export class S3Storage {
  private client: S3Client

  constructor() {
    this.client = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey
      }
    })
  }

  async upload(key: string, file: Buffer, options: {
    contentType: string
    metadata?: Record<string, string>
    acl?: string
  }) {
    try {
      const command = new PutObjectCommand({
        Bucket: config.aws.bucket,
        Key: key,
        Body: file,
        ContentType: options.contentType,
        Metadata: options.metadata,
        ACL: options.acl || 'public-read'
      })

      await this.client.send(command)

      return {
        key,
        url: `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${key}`,
        contentType: options.contentType,
        metadata: options.metadata
      }
    } catch (error) {
      logger.error('S3 upload error:', error)
      throw new ApiError('Failed to upload file', 500)
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: config.aws.bucket,
        Key: key
      })

      return getSignedUrl(this.client, command, { expiresIn })
    } catch (error) {
      logger.error('S3 signed URL error:', error)
      throw new ApiError('Failed to generate signed URL', 500)
    }
  }

  async delete(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: config.aws.bucket,
        Key: key
      })

      await this.client.send(command)
    } catch (error) {
      logger.error('S3 delete error:', error)
      throw new ApiError('Failed to delete file', 500)
    }
  }
}

export const s3Storage = new S3Storage()