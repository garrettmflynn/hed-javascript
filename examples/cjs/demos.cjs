
const valid = async (hed, schema) => {
  console.log('%cCalling hed-validator on a valid HED string', 'font-weight: bold')

  // Initializing parameters and making the call
  const validHedString =
    'Event/Category/Experimental stimulus,Item/Object/Vehicle/Train,Attribute/Visual/Color/Purple'
  const [isValid1, issues1] = hed.validator.validateHedString(
    validHedString,
    schema
  )

  console.log('Is Valid', isValid1)
  console.log('Issues', issues1)
}

const syntacticError = async (hed, schema) => {

  console.log('%cCalling hed-validator when the HED string has a syntactic error (mismatched parentheses)', 'font-weight: bold')
  // Initializing parameters and making the call
  const invalidHedString2 =
    '/Action/Reach/To touch,((/Attribute/Object side/Left,/Participant/Effect/Body part/Arm),/Attribute/Location/Screen/Top/70 px'
  const [isValid2, issues2] = hed.validator.validateHedString(
    invalidHedString2,
  )

  console.log('Is Valid', isValid2)
  console.log('Issues', issues2)
}


const syntacticWarning = async (hed, schema) => {
  console.log('%cCalling hed-validator when the HED string has a syntactic warning (bad capitalization), but no errors', 'font-weight: bold')
  const warningHedString = 'Event/something'
  const [isErrorFree, errorIssues] = hed.validator.validateHedString(
    warningHedString,
    schema
  )
  const [isWarningFree, warningIssues] = hed.validator.validateHedString(
    warningHedString,
    schema,
    true,
  )

  console.log('Is Valid', isErrorFree)
  console.log('Issues', errorIssues)
  console.log('Is Warning Free', isWarningFree)
  console.log('Issues', warningIssues)
}

const semanticError = async (hed, schema) => {

  console.log('%cCalling hed-validator when the HED string has a semantic error (invalid tag)', 'font-weight: bold')

  // Initialize parameter
  const invalidHedString4 = 'Item/Nonsense'
  // Build schema
    // Validate
    const [isValid4, issues4] = hed.validator.validateHedString(
      invalidHedString4,
      schema,
    )
    console.log('Is Valid', isValid4)
    console.log('Issues', issues4)

}


const nondefaultSchema = async (hed) => {

  console.log('%cLoading a non-default HED schema version', 'font-weight: bold')

  const validHedString5 =
    'Event/Category/Experimental stimulus,Item/Object/Vehicle/Train,Attribute/Visual/Color/Purple'

  // Load a remotely hosted schema version.
  const hedSchema = await hed.validator.buildSchema({ version: '8.0.0' }).catch(e => {
    console.log('[5 Remote]', e)
  })

  // Validate
  const [
    isValid5Remote,
    issues5Remote,
  ] = hed.validator.validateHedString(validHedString5, hedSchema)
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
      ] = hed.validator.validateHedString(validHedString5, hedSchema2)
      // Do something with results...


      console.log('Local')
      console.log('Is Valid', isValid5Local)
      console.log('Issues', issues5Local)
}


module.exports = {
  valid,
  syntacticError,
  syntacticWarning,
  semanticError,
  nondefaultSchema
}