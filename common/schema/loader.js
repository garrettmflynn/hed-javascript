/** HED schema loading functions. */

/* Imports */

import isEmpty from 'lodash/isEmpty'
import * as files from '../../utils/files'
import * as utils from '../../utils/string'
import xml2js from 'xml2js'

import { fallbackFilePath } from './config'

/**
 * Load schema XML data from a schema version or path description.
 *
 * @param {{path: string?, library: string?, version: string?}} schemaDef The description of which schema to use.
 * @param {boolean} useFallback Whether to use a bundled fallback schema if the requested schema cannot be loaded.
 * @return {Promise<never>|Promise<object>} The schema XML data or an error.
 */
const loadSchema = function (schemaDef = {}, useFallback = true) {
    if (isEmpty(schemaDef)) {
      schemaDef.version = 'Latest'
    }
    let schemaPromise

  // Browser Only
  if (globalThis.File && schemaDef instanceof globalThis.File) {
    schemaPromise = loadBrowserSchema(schemaDef)
  } 
  
  // Browser + Node Compatible Code
  else if (schemaDef.path) {
      schemaPromise = loadLocalSchema(schemaDef.path)
    } /* else if (schemaDef.library) {
    return loadRemoteLibrarySchema(schemaDef.library, schemaDef.version)
  } */ else if (schemaDef.version) {
      schemaPromise = loadRemoteBaseSchema(schemaDef.version)
    } else {
      return Promise.reject(new Error('Invalid schema definition format.'))
    }

    return schemaPromise.catch((error) => {
      if (!useFallback || error.message === files.browserError) {
        throw error
      } else { // Catch loadLocalSchema() method error
        return loadLocalSchema(fallbackFilePath)
      }
    })

}

/**
 * Load base schema XML data from the HED specification GitHub repository.
 *
 * @param {string} version The base schema version to load.
 * @return {Promise<object>} The schema XML data.
 */
const loadRemoteBaseSchema = function (version = 'Latest') {
  const url = `https://raw.githubusercontent.com/hed-standard/hed-specification/master/hedxml/HED${version}.xml`
  return loadSchemaFile(
    files.readHTTPSFile(url),
    utils.stringTemplate`Could not load HED base schema, version "${1}", from remote repository - "${0}".`,
    ...arguments,
  )
}

/**
 * Load library schema XML data from the HED specification GitHub repository.
 *
 * @param {string} library The library schema to load.
 * @param {string} version The schema version to load.
 * @return {Promise<object>} The library schema XML data.
 */
const loadRemoteLibrarySchema = function (library, version = 'Latest') {
  const url = `https://raw.githubusercontent.com/hed-standard/hed-schema-library/master/hedxml/HED_${library}_${version}.xml`
  return loadSchemaFile(
    files.readHTTPSFile(url),
    utils.stringTemplate`Could not load HED library schema ${1}, version "${2}", from remote repository - "${0}".`,
    ...arguments,
  )
}

/**
 * Load schema XML data from a local file.
 *
 * @param {string} path The path to the schema XML data.
 * @return {Promise<object>} The schema XML data.
 */
const loadLocalSchema = function (path) {
  return loadSchemaFile(
    files.readFile(path),
    utils.stringTemplate`Could not load HED schema from path "${1}" - "${0}".`,
    ...arguments,
  )
}

/**
 * Load schema XML data from a browser-specified File object.
 *
 * @param {File} file A browser File object to load.
 * @return {Promise<object>} The schema XML data.
 */
const loadBrowserSchema = function (file) {
  return loadSchemaFile(
    files.readBrowserFile(file),
    utils.stringTemplate`Could not load HED schema from path "${1}" - "${0}".`,
    ...arguments,
  )
}

/**
 * Actually load the schema XML file.
 *
 * @param {Promise<string>} xmlDataPromise The Promise containing the unparsed XML data.
 * @param {function(...[*]): string} errorMessage A tagged template literal containing the error message.
 * @param {Array} errorArgs The error arguments passed from the calling function.
 * @return {Promise<object>} The parsed schema XML data.
 */
const loadSchemaFile = function (xmlDataPromise, errorMessage, ...errorArgs) {
  return xmlDataPromise.then(parseSchemaXML).catch((error) => {
    throw new Error(errorMessage(error, ...errorArgs))
  })
}

/**
 * Parse the schema XML data.
 *
 * @param {string} data The XML data.
 * @return {Promise<object>} The schema XML data.
 */

const parseSchemaXML = async function (data) {
  return await xml2js.parseStringPromise(data, { explicitCharkey: true })
}

export {
  loadSchema
}
