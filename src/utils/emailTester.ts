export default (email: string) => {
  if (!email) return false
  const emailRegex =
    /^(?!\.)(?!.*\.\.)([A-Z0-9_+-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i

  if (email.length > 254) return false

  if (!emailRegex.test(email)) return false

  const parts = email.split('@')
  if (parts.length !== 2) return false
  if (parts[0].length > 64) return false
  return true
}
