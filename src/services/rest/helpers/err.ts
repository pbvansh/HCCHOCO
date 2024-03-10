interface CustomeError extends Error {
  field?: string
  symbol?: symbol | null
}

export default (
  message: string,
  fieldName: string,
  symbol: symbol | null = null,
) => {
  const err: CustomeError = new Error(message)
  err.field = fieldName
  err.symbol = symbol
  return err
}
