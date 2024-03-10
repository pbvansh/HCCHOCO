import { MongoClient } from 'mongodb'
import config from '../config'

const mongoURL = config.mongoDB.URL || ''

const mongoConnection = new MongoClient(mongoURL)

mongoConnection
  .connect()
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch(e => {
    console.log(e)
  })

const mongoDB = mongoConnection

export default mongoDB
