import MongoDb from 'mongodb'

export const findDocument = (
  collection: Function,
  mongoDB: MongoDb.MongoClient,
  condition: object,
  projection?: object,
) => collection(mongoDB).findOne(condition, { projection })

export const findDocuments = (
  collection: Function,
  mongoDB: MongoDb.MongoClient,
  condition: object,
  projection?: object,
) => collection(mongoDB).findMany(condition, { projection }).toArray()

export const createDocument = (
  collection: Function,
  mongoDB: MongoDb.MongoClient,
  data: object,
) => collection(mongoDB).insertOne(data)

export const createDocuments = (
  collection: Function,
  mongoDB: MongoDb.MongoClient,
  data: object[],
) => collection(mongoDB).insertMany(data)

export const updateDocument = (
  collection: Function,
  mongoDB: MongoDb.MongoClient,
  condition: object,
  updateData: object,
  options?: object,
) => collection(mongoDB).updateOne(condition, updateData, options)

export const updateDocuments = (
  collection: Function,
  mongoDB: MongoDb.MongoClient,
  condition: object,
  updateData: object,
  options?: object,
) => collection(mongoDB).updateMany(condition, updateData, options)

export const distinct = (
  collection: Function,
  mongoDB: MongoDb.MongoClient,
  fieldName: string,
  condition: object,
) => collection(mongoDB).distinct(fieldName, condition)
