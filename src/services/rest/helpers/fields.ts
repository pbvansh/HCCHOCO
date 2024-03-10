import Koa from 'koa'

export const getFieldIntoCTX = (ctx: Koa.DefaultContext, fieldName: string) => {
  let fieldValue = ''
  if (ctx.request.body?.[fieldName]) {
    fieldValue = ctx.request.body[fieldName]
  } else if (ctx.params?.[fieldName]) {
    fieldValue = ctx.params[fieldName]
  } else if (ctx.query?.[fieldName]) {
    fieldValue = ctx.query[fieldName]
  }
  return fieldValue
}

export const addToState = (
  ctx: Koa.DefaultContext,
  stateName: 'modifiedFields' | 'shared' | 'user' | 'validationErrors',
  data: object,
) => {
  ctx.state[stateName] = {
    ...(ctx.state[stateName] || {}),
    ...data,
  }
}

export const isProtectedFieldsExist = (
  dataToCheck: object,
  unprotectedFields: string[],
) => {
  const keys = Object.keys(dataToCheck)
  return keys.some(key => !unprotectedFields.includes(key))
}

export const removeUndefinedValues = (
  data: { [key: string]: any },
  preventNullValue: boolean = false,
) => {
  for (const key in data) {
    if (
      typeof data[key] === 'undefined' ||
      (typeof data[key] === 'string' && !data[key].trim()) ||
      (!preventNullValue && data[key] === null)
    ) {
      delete data[key]
    }
  }
  return data
}

export const arrayValidator = (
  array: Array<string | number | object>,
  type: string,
  lengthRequired: boolean = true,
  trim: boolean = true,
) => {
  if (!Array.isArray(array) || (lengthRequired && !array.length)) return false

  return array.some(elm => {
    if (
      typeof elm === type &&
      (!trim || (trim && typeof elm === 'string' && elm.trim()))
    ) {
      return true
    }
    return false
  })
}
