import { anyType } from 'types/anyType'

export const isValidString = (
  value: anyType,
  isRequired: boolean = true,
  spaceAllowed: boolean = false,
) => {
  let ans = true
  if (isRequired && spaceAllowed) {
    ans = value && typeof value === 'string'
  } else if (isRequired && !spaceAllowed) {
    ans = value && typeof value === 'string' && value.trim()
  } else if (!isRequired) {
    ans =
      !value ||
      typeof value === undefined ||
      (typeof value === 'string' && !value.trim())
  }
  return ans
}
