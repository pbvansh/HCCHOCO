import { arrayValidator } from './fields'

export default (
  tags: string[],
  singleTagMaxChar: number,
  maxTags: number,
  oldTags?: string[],
) => {
  if (!arrayValidator(tags, 'string')) {
    return {
      error: true,
      message: 'Please provide valid tags',
    }
  }

  const filteredTags = Array.from(new Set(tags))
  let uniqueTags = true
  let allTagsValid = true

  tags.forEach(tag => {
    if (oldTags && oldTags.length && oldTags.includes(tag)) {
      uniqueTags = false
    } else if (tag.length > singleTagMaxChar) {
      allTagsValid = false
    }
  })

  const totalTags = filteredTags.length + (oldTags?.length || 0)
  if (totalTags > maxTags) {
    return {
      error: true,
      message: `Max ${maxTags} tags allowed`,
    }
  }

  if (!uniqueTags) {
    return {
      error: true,
      message: 'Please provide unique tags',
    }
  }
  if (!allTagsValid) {
    return {
      error: true,
      message: `Single tags length should be less than ${singleTagMaxChar} characters`,
    }
  }

  return {
    error: false,
    filteredTags,
  }
}
