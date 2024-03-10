import aws from 'aws-sdk'
import { anyType } from 'types/anyType'
import config from 'config'

export const uploadFile = async (
  contentType: string = 'application/json',
  key: string = 'unknown',
  data: anyType,
) => {
  const { s3BucketName, s3ApiVersion, s3Region, accessKeyId, secretAccessKey } =
    config.aws || {}
  const S3 = new aws.S3({
    region: s3Region,
    accessKeyId,
    secretAccessKey,
    apiVersion: s3ApiVersion,
  })
  try {
    await S3.putObject({
      // @ts-ignore
      Bucket: s3BucketName || '',
      Key: key,
      ContentType: contentType,
      ACL: 'public-read',
      Body: data,
    }).promise()

    return {
      ok: true,
      // @ts-ignore
      url: `https://${s3BucketName[usedFor]}.s3.amazonaws.com/${key}`,
    }
  } catch (error) {
    return { ok: false, message: error.message || '' }
  }
}
