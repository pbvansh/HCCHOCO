import Koa from 'koa'
import bluebird from 'bluebird'

export default (validators: Function[]) =>
  async (ctx: Koa.DefaultContext, next: Function) => {
    ctx.state.validationErrors = []
    const validationResult = await bluebird.mapSeries(
      validators,
      async validator => {
        const result = await validator(ctx, next)
        result !== null && ctx.state.validationErrors.push(result)
        return result
      },
    )

    //if any validation error present than we throw error
    const filteredValidationErros = validationResult.filter(
      result => result !== null,
    )

    if (filteredValidationErros.length) {
      const allErrors = {
        reasons: filteredValidationErros.map(result => ({
          message: result.message,
          field: result.field,
        })),
      }
      ctx.throw(400, 'Validation Failed', allErrors)
    }

    //if all validater pass succesfully than we call the controller
    return next()
  }
