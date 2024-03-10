import { isValidString } from '../validators/commen'

export default (password: string) => {
  if (!isValidString(password)) return false
  const passRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]{8,}$/
  return passRegex.test(password)
}
