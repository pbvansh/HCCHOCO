import Koa from 'koa'
import { isValidString } from '../commen'
import err from 'services/rest/helpers/err'
import { addToState } from 'services/rest/helpers/fields'
import tagsValidator from 'services/rest/helpers/tagsValidator'
import config from 'config'
import md5 from 'md5'

export const isPlateNameValid = async (ctx: Koa.DefaultContext) => {
  const { plateName } = ctx.request.body
  console.log(md5('Pratik@0165'))

  if (!isValidString(plateName)) {
    return err('Please provide valid codeplate name', 'platName')
  }

  const trimedName = plateName.trim()

  if (trimedName.length < 3 || trimedName.length > 30) {
    return err(
      'Codeplate name must be between 3 and 30 characters',
      'plateName',
    )
  }

  addToState(ctx, 'modifiedFields', { plateName: trimedName })

  return null
}

export const isDescValid = async (ctx: Koa.DefaultContext) => {
  const { desc } = ctx.request.body
  if (!desc) return null

  if (!isValidString(desc)) {
    return err('Please provide valid description', 'desc')
  }

  const trimedDesc = desc.trim()

  if (trimedDesc.length < 3 || trimedDesc.length > 5000) {
    return err('Description must be between 3 to 5000 characters', 'desc')
  }

  addToState(ctx, 'modifiedFields', { desc: trimedDesc })

  return null
}

export const isValidTags = async (ctx: Koa.DefaultContext) => {
  if (!('tags' in ctx.request.body)) return null
  const { tags } = ctx.request.body
  const oldTags = ['a']
  const result = tagsValidator(tags, 100, 100, oldTags)

  if (result.error) {
    return err(result.message || '', 'tags')
  }

  addToState(ctx, 'modifiedFields', { tags: result.filteredTags })

  return null
}

export const isLanguageValid = async (ctx: Koa.DefaultContext) => {
  const { language } = ctx.request.body
  if (!language) {
    return err('Please select valid coding language', 'language')
  }

  if (!config.code.supportedLanguage.includes(language)) {
    return err(`We don't support ${language} language`, 'language')
  }

  return null
}

export const isSnippetValid = async (ctx: Koa.DefaultContext) => {
  const { snippet } = ctx.request.body

  if (!snippet || !(typeof snippet === 'string' && snippet.trim())) {
    return err('Please write some code first than save', 'snippet')
  }

  if (snippet.length > 50000) {
    return err('We support the max 50,000 line of code to save', 'snippet')
  }

  return null
}
