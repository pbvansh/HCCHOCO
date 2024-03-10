import Koa from 'koa'
import XLSX from 'xlsx'

export const saveCode = async (ctx: Koa.DefaultContext) => {
  console.log(ctx.state.modifiedFields)

  ctx.body = {
    message: 'Code saved successfully',
  }
}
