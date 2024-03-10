import Koa from 'koa'
import mongoDB from 'db'
import * as userQ from 'db/queries/users'
import * as commonQ from 'db/queries/common'
import { Connection, Action } from 'spamd-client'
// import spamscanner from 'spamscanner'
const SpamScanner = require('spamscanner')
import { VerifaliaRestClient } from 'verifalia'
import Bluebird from 'bluebird'
import axios from 'axios'
import { createJwt, createTokenKey } from 'services/rest/helpers/token'
import generateUUID from 'utils/uuid'
import md5 from 'md5'
import config from 'config'

export const login = async (ctx: Koa.DefaultContext) => {
  const {
    userInfo: { userId, ownerId, role, password: userPassword },
  } = ctx.state.shared

  const { email, password } = ctx.state.modifiedFields

  const token = createJwt(
    {
      userId,
      ownerId,
      role,
      tokenKey: createTokenKey(userId, userPassword, role),
    },
    config.jwt.secret,
  )

  //update last login details

  ctx.body = {
    message: 'User login successfully',
    response: {
      token,
    },
  }
}

export const signup = async (ctx: Koa.DefaultContext) => {
  const { email, firstName, lastName, password } = ctx.state.modifiedFields
  const ip = ctx.ip || ctx.request.ip
  console.log({ ip })
  console.log({ ipp: ctx.request.ip })
  console.log(firstName)

  const userId = generateUUID()
  const user = {
    userId,
    ownerId: userId,
    email,
    firstName,
    lastName,
    password: md5(password),
    ip,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  }

  const result = await commonQ.createDocument(
    userQ.getCollection,
    mongoDB,
    user,
  )

  const userInfo = await commonQ.findDocument(userQ.getCollection, mongoDB, {
    email,
  })

  if (!user) {
    ctx.throw('Sorry, Please try again to signup')
  }

  const role = 'O'
  const token = createJwt(
    {
      userId: userInfo.userId,
      ownerId: userInfo.ownerId,
      role,
      tokenKey: createTokenKey(userInfo.userId, userInfo.password, role),
    },
    config.jwt.secret,
  )

  ctx.body = {
    message: 'Signup successfully',
    response: { token },
  }
}

export const emailSpamSocre = async (ctx: Koa.DefaultContext) => {
  const { emailContent } = ctx.request.body
  // const buff = Buffer.from(emailContent, 'utf8')
  // const scanner = new SpamScanner()
  // try {
  //   const report = await scanner.scan(buff)
  //   const phis = await scanner.getPhishingResults(buff)
  //   console.dir({ report }, { depth: null })
  //   console.dir({ phis }, { depth: null })
  // } catch (error) {
  //   console.log({ error })
  // }

  const connect = Connection.of({ host: 'example.com', port: 2233 })

  connect()
    .then(Action.check(emailContent))
    .then(console.log) // EX: { isSpam: true, score: -0.8, threshold: 5 }
    .catch(console.error) // EX: Error: Cannot connect

  // console.log({ report })

  ctx.body = {
    message: 'from email spam scoring',
  }
}

const BIGDATA_API = 'https://api-bdc.net/data/email-verify'
const BIGDATA_API_KEY = 'bdc_4ef128b5c27e4778be7354c689fddc11'

const DISIFY_API = 'https://www.disify.com/api/email/'

export const emailValidatinAccuracy = async (ctx: Koa.DefaultContext) => {
  console.log('start')

  const verifalia = new VerifaliaRestClient({
    // username: '1f981119914f4e33895d97ccffea5a09',
    // password: 'AccuracyScore123',
    username: '80e44c33622f4a7b8821ee9b67504291',
    password: 'AccuracyScore19147',
  })

  const { emails } = ctx.request.body

  let verifaliaRespose: any = []
  let disifyRespose: any = []
  let bigDataRespose: any = []

  await Bluebird.mapSeries(emails, async (email: string) => {
    console.log({ email })

    // try {

    // } catch (error) {
    //   verifaliaRespose.push({})
    // }
    const result = await verifalia.emailValidations.submit(email)
    const store = result && result.entries[0]
    console.log({ store })

    verifaliaRespose.push(store)

    // try {
    //   const result1 = await axios.get(`${DISIFY_API}${email}`)
    // } catch (error) {
    //   disifyRespose.push({})
    // }

    // try {
    //   const result2 = await axios.get(
    //     `${BIGDATA_API}?emailAddress=${email}&key=${BIGDATA_API_KEY}`,
    //   )
    //   bigDataRespose.push(result2.data)
    // } catch (error) {
    //   bigDataRespose.push({})
    // }
  })

  ctx.body = {
    message: 'Response form accuracy score',
    verifaliaRespose,
    disifyRespose,
    bigDataRespose,
  }
}

const data = [
  'jaiveerjove@gmail.com',
  'kpratiksha1131@gmail.com',
  'dhruv@casaugc.com',
  'rutul2@socialpilot.co',
  'pratiksha@socialpilot.co',
  'woicepsa@gmail.com',
  'savan+review@socialpilot.co',
  'vanshpratik0165+prod1@gmail.com',
  'vanshpratik0165+prod@gmail.com',
  'shahgyanendra789@gmail.com',
  'jimit@socialpilot.co',
  'info@partnersinlocalsearch.com',
  'design@flaircommunication.com',
  'kadampratiksha1704@gmail.com',
  'jack@50poundsocial.co.uk',
  'dustin@fusionnow.io',
  'athompsonlds@gmail.com',
  'info@agencymediasolutions.com',
  'dhruvbhatia7@gmail.com',
  'hello@quillmarketing.com',
  'nathan@americanwestrealty.com',
  'madhan@socialpilot.co',
  'kak@kakvarley.com',
  'michelle@realmarketingmuscle.com',
  'mitch@1sixty8.com',
]
