// TODO: Switch require once upstream bugs are fixed.
// import xpath from 'xml2js-xpath'
// Temporary
import * as xpath from '../utils/xpath.js'

import * as schemaUtils from '../common/schema/index.js'
import { asArray } from '../utils/array.js'
import { setParent } from '../utils/xml2js.js'

import {TagEntry, Mapping} from './types.js'

/**
 * Build a short-long mapping object from schema XML data.
 *
 * @param {object} xmlData The schema XML data.
 * @return {Mapping} The mapping object.
 */
const buildMappingObject = function (xmlData) {
  const nodeData = new Map()
  const tagElementData = new Map()
  let hasNoDuplicates = true
  const rootElement = xmlData.HED
  setParent(rootElement, null)
  const tagElements = xpath.find(rootElement, '//node')
  for (const tagElement of tagElements) {
    if (getElementTagValue(tagElement) === '#') {
      tagElementData.get(tagElement.$parent).takesValue = true
      continue
    }
    const tagPath = getTagPathFromTagElement(tagElement)
    const shortPath = tagPath[0]
    const cleanedShortPath = shortPath.toLowerCase()
    tagPath.reverse()
    const longPath = tagPath.join('/')
    const tagObject = new TagEntry(shortPath, longPath)
    tagElementData.set(tagElement, tagObject)
    if (!nodeData.has(cleanedShortPath)) {
      nodeData.set(cleanedShortPath, tagObject)
    } else {
      hasNoDuplicates = false
      const duplicateArray = asArray(nodeData.get(cleanedShortPath))
      duplicateArray.push(tagObject)
      nodeData.set(cleanedShortPath, duplicateArray)
    }
  }
  return new Mapping(nodeData, hasNoDuplicates)
}

const getTagPathFromTagElement = function (tagElement) {
  const ancestorTags = [getElementTagValue(tagElement)]
  let parentTagName = getParentTagName(tagElement)
  let parentElement = tagElement.$parent
  while (parentTagName) {
    ancestorTags.push(parentTagName)
    parentTagName = getParentTagName(parentElement)
    parentElement = parentElement.$parent
  }
  return ancestorTags
}

const getElementTagValue = function (element, tagName = 'name') {
  return element[tagName][0]._
}

const getParentTagName = function (tagElement) {
  const parentTagElement = tagElement.$parent
  if (parentTagElement && 'name' in parentTagElement) {
    return parentTagElement.name[0]._
  } else {
    return ''
  }
}

/**
 * Build a schema container object containing a short-long mapping from a base schema version or path description.
 *
 * @param {{path: string?, version: string?}} schemaDef The description of which schema to use.
 * @return {Promise<never>|Promise<Schemas>} The schema container object or an error.
 */
const buildSchema = function (schemaDef = {}) {
  return schemaUtils.loadSchema(schemaDef).then((xmlData) => {
    console.log('xmlData', xmlData)
    const mapping = buildMappingObject(xmlData)
    const baseSchema = new schemaUtils.Schema(xmlData, undefined, mapping)
    return new schemaUtils.Schemas(baseSchema)
  })
}

export {
  buildSchema,
  buildMappingObject,
}
