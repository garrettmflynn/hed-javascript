import {tags} from './index.js'

export const valid = async (hed) => {
  console.log('%cCalling hed-validator on a valid HED string', 'font-weight: bold')

  // Initializing parameters and making the call
  const [isValid1, issues1] = hed.validator.validateHedString(
    tags.valid,
  )

  console.log('Is Valid', isValid1)
  console.log('Issues', issues1)
}

export const syntacticError =async (hed, schema) => {

  console.log('%cCalling hed-validator when the HED string has a syntactic error (mismatched parentheses)', 'font-weight: bold')
  // Initializing parameters and making the call
  const [isValid2, issues2] = hed.validator.validateHedString(
    tags.errors.syntactic,
    schema
  )

  console.log('Is Valid', isValid2)
  console.log('Issues', issues2)
}


export const syntacticWarning = async (hed, schema) => {
  console.log('%cCalling hed-validator when the HED string has a syntactic warning (bad capitalization), but no errors', 'font-weight: bold')
  const [isErrorFree, errorIssues] = hed.validator.validateHedString(
    tags.warning,
    schema,
  )
  const [isWarningFree, warningIssues] = hed.validator.validateHedString(
    tags.warning,
    schema,
    true,
  )

  console.log('Is Valid', isErrorFree)
  console.log('Issues', errorIssues)
  console.log('Is Warning Free', isWarningFree)
  console.log('Issues', warningIssues)
}

export const semanticError = async (hed, schema) => {

  console.log('%cCalling hed-validator when the HED string has a semantic error (invalid tag)', 'font-weight: bold')

    const [isValid4, issues4] = hed.validator.validateHedString(
      tags.errors.semantic,
      schema,
      true
    )
    console.log('Is Valid', isValid4)
    console.log('Issues', issues4)
}


export const nondefaultSchema = async (hed) => {

  console.log('%cLoading a non-default HED schema version', 'font-weight: bold')

  
  // Load a remotely hosted schema version.
  const hedSchema = await hed.validator.buildSchema({ version: '8.0.0' }).catch(e => {
    console.log('[5 Remote]', e)
  })

  // Validate
  const [
    isValid5Remote,
    issues5Remote,
  ] = hed.validator.validateHedString(tags.valid, hedSchema)
  // Do something with results...

  console.log('Remote')
  console.log('Is Valid', isValid5Remote)
  console.log('Issues', issues5Remote)

  // Load a local schema file.
  const hedSchema2 = await  hed.validator
    .buildSchema({ path: 'data/HED8.0.0.xml' }).catch(e => {
      console.log('[5 Local]', e)
    })

      // Validate
      const [
        isValid5Local,
        issues5Local,
      ] = hed.validator.validateHedString(tags.valid, hedSchema2)
      // Do something with results...


      console.log('Local')
      console.log('Is Valid', isValid5Local)
      console.log('Issues', issues5Local)
}