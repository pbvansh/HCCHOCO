import jwt from 'jsonwebtoken'
import md5 from 'md5'
import { UserRoles } from 'types/user'

interface payload {
  userId: string
  ownerId: string
  role: UserRoles
  tokenKey: string
}

export const createTokenKey = (
  userId: string,
  password: string,
  role: UserRoles,
) => md5(`${userId}${password}${role}`)

export const createJwt = (
  data: payload,
  secret: string,
  expiresIn: string = '60d',
) => jwt.sign(data, secret, { expiresIn })
