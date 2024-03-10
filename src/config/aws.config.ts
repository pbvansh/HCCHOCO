const env = process.env

export default {
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_ACCESS_SECRET,
  region: env.AWS_REGION || 'us-east-1',
  s3ApiVersion: '2006-03-01',
  s3Region: 'us-east-1',
  s3BucketName: 'hennessy-image',
}
