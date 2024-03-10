const env = process.env

export default {
  DB: env.DB_NAME,
  URL: env.MONGO_URL,
}
