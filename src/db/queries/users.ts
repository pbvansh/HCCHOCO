import MongoDB from 'mongodb'
import config from '../../config'
import mongoDB from 'db'

const collection = 'users'

export const getCollection = (mongoDB: MongoDB.MongoClient) =>
  mongoDB.db(config.mongoDB.DB).collection(collection)

export const getUserList = (mongoDB: MongoDB.MongoClient) =>
  getCollection(mongoDB).find({}).toArray()

export const getAllOwners = (mongoDB: MongoDB.MongoClient, userId: string) =>
  getCollection(mongoDB)
    .aggregate([
      {
        $match: { userId },
      },
      {
        $project: {
          userId: 1,
          ownerDetails: 1,
        },
      },
      {
        $unwind: '$ownerDetails',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ownerDetails.ownerId',
          foreignField: 'userId',
          as: 'ownerDetails',
          pipeline: [
            {
              $project: {
                email: 1,
                ownerName: { $concat: ['$firstName', ' ', '$lastName'] },
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          ownerId: '$ownerDetails.userId',
          ownerEmail: '$ownerDetails.email',
          ownerName: '$ownerDetails.ownerName',
          role: 1,
        },
      },
    ])
    .toArray()
