const env = process.env

export default {
  secret: env.JWT_SECRET || '',
}
