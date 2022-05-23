import {assert} from 'chai'
import * as hed from '../validator/dataset'
import * as schema from '../validator/schema/init'
import {generateIssue as generateValidationIssue} from '../common/issues/issues'
import generateConverterIssue from '../converter/issues'

describe('HED dataset validation', () => {
  const hedSchemaFile = 'tests/data/HED8.0.0.xml'
  let hedSchemaPromise

  beforeAll(() => {
    hedSchemaPromise = schema.buildSchema({ path: hedSchemaFile })
  })

  describe('Basic HED string lists', () => {
    /**
     * Test-validate a dataset.
     *
     * @param {object<string, string[]>} testDatasets The datasets to test.
     * @param {object<string, Issue[]>} expectedIssues The expected issues.
     */
    const validator = function (testDatasets, expectedIssues) {
      return hedSchemaPromise.then((hedSchema) => {
        for (const testDatasetKey in testDatasets) {
          const [, testIssues] = hed.validateHedEvents(
            testDatasets[testDatasetKey],
            hedSchema,
            null,
            true,
          )
          assert.sameDeepMembers(
            testIssues,
            expectedIssues[testDatasetKey],
            testDatasets[testDatasetKey].join(','),
          )
        }
      })
    }

    it('should properly validate simple HED datasets', () => {
      const testDatasets = {
        empty: [],
        singleValidLong: ['Event/Sensory-event'],
        singleValidShort: ['Sensory-event'],
        multipleValidLong: [
          'Event/Sensory-event',
          'Item/Object/Man-made-object/Vehicle/Train',
          'Property/Sensory-property/Sensory-attribute/Visual-attribute/Color/RGB-color/RGB-red/0.5',
        ],
        multipleValidShort: ['Sensory-event', 'Train', 'RGB-red/0.5'],
        multipleValidMixed: ['Event/Sensory-event', 'Train', 'RGB-red/0.5'],
        multipleInvalid: ['Duration/0.5 cm', 'InvalidEvent'],
      }
      const legalTimeUnits = ['s', 'second', 'day', 'minute', 'hour']
      const expectedIssues = {
        empty: [],
        singleValidLong: [],
        singleValidShort: [],
        multipleValidLong: [],
        multipleValidShort: [],
        multipleValidMixed: [],
        multipleInvalid: [
          generateValidationIssue('unitClassInvalidUnit', {
            tag: testDatasets.multipleInvalid[0],
            unitClassUnits: legalTimeUnits.sort().join(','),
          }),
          // TODO: Duplication temporary
          generateValidationIssue('invalidTag', {
            tag: testDatasets.multipleInvalid[1],
          }),
          generateConverterIssue(
            'invalidTag',
            testDatasets.multipleInvalid[1],
            {},
            [0, 12],
          ),
        ],
      }
      return validator(testDatasets, expectedIssues)
    })
  })

  describe('Full HED datasets', () => {
    /**
     * Test-validate a dataset.
     *
     * @param {object<string, string[]>} testDatasets The datasets to test.
     * @param {object<string, Issue[]>} expectedIssues The expected issues.
     */
    const validator = function (testDatasets, expectedIssues) {
      return hedSchemaPromise.then((hedSchema) => {
        for (const testDatasetKey in testDatasets) {
          const [, testIssues] = hed.validateHedDataset(
            testDatasets[testDatasetKey],
            hedSchema,
            true,
          )
          assert.sameDeepMembers(
            testIssues,
            expectedIssues[testDatasetKey],
            testDatasets[testDatasetKey].join(','),
          )
        }
      })
    }

    it('should properly validate HED datasets without definitions', () => {
      const testDatasets = {
        empty: [],
        singleValidLong: ['Event/Sensory-event'],
        singleValidShort: ['Sensory-event'],
        multipleValidLong: [
          'Event/Sensory-event',
          'Item/Object/Man-made-object/Vehicle/Train',
          'Property/Sensory-property/Sensory-attribute/Visual-attribute/Color/RGB-color/RGB-red/0.5',
        ],
        multipleValidShort: ['Sensory-event', 'Train', 'RGB-red/0.5'],
        multipleValidMixed: ['Event/Sensory-event', 'Train', 'RGB-red/0.5'],
        multipleInvalid: ['Duration/0.5 cm', 'InvalidEvent'],
      }
      const legalTimeUnits = ['s', 'second', 'day', 'minute', 'hour']
      const expectedIssues = {
        empty: [],
        singleValidLong: [],
        singleValidShort: [],
        multipleValidLong: [],
        multipleValidShort: [],
        multipleValidMixed: [],
        multipleInvalid: [
          generateValidationIssue('unitClassInvalidUnit', {
            tag: testDatasets.multipleInvalid[0],
            unitClassUnits: legalTimeUnits.sort().join(','),
          }),
          // TODO: Duplication temporary
          generateValidationIssue('invalidTag', {
            tag: testDatasets.multipleInvalid[1],
          }),
          generateConverterIssue(
            'invalidTag',
            testDatasets.multipleInvalid[1],
            {},
            [0, 12],
          ),
        ],
      }
      return validator(testDatasets, expectedIssues)
    })

    it('should properly validate HED datasets with definitions', () => {
      const testDatasets = {
        valid: [
          '(Definition/BlueSquare,(Blue,Square))',
          '(Definition/RedCircle,(Red,Circle))',
        ],
        equalDuplicateDefinition: [
          '(Definition/BlueSquare,(Blue,Square))',
          '(Definition/BlueSquare,(Blue,Square))',
          '(Definition/RedCircle,(Red,Circle))',
        ],
        nonEqualDuplicateDefinition: [
          '(Definition/BlueSquare,(Blue,Square))',
          '(Definition/BlueSquare,(RGB-blue/1.0,Square))',
          '(Definition/RedCircle,(Red,Circle))',
        ],
        valueDuplicateDefinition: [
          '(Definition/BlueSquare,(Blue,Square))',
          '(Definition/BlueSquare/#,(RGB-blue/#,Square))',
          '(Definition/RedCircle,(Red,Circle))',
        ],
      }
      const expectedIssues = {
        valid: [],
        equalDuplicateDefinition: [],
        nonEqualDuplicateDefinition: [
          generateValidationIssue('duplicateDefinition', {
            definition: 'BlueSquare',
            tagGroup: '(Definition/BlueSquare,(Blue,Square))',
          }),
          generateValidationIssue('duplicateDefinition', {
            definition: 'BlueSquare',
            tagGroup: '(Definition/BlueSquare,(RGB-blue/1.0,Square))',
          }),
        ],
        valueDuplicateDefinition: [
          generateValidationIssue('duplicateDefinition', {
            definition: 'BlueSquare',
            tagGroup: '(Definition/BlueSquare,(Blue,Square))',
          }),
          generateValidationIssue('duplicateDefinition', {
            definition: 'BlueSquare',
            tagGroup: '(Definition/BlueSquare/#,(RGB-blue/#,Square))',
          }),
        ],
      }
      return validator(testDatasets, expectedIssues)
    })
  })
})
