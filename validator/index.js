import * as BIDS from './bids/index.js'
import * as dataset from './dataset.js'
import * as event from './event/index.js'
import * as schema from './schema/init.js'

export default  {
  BidsDataset: BIDS.BidsDataset,
  BidsEventFile: BIDS.BidsEventFile,
  BidsSidecar: BIDS.BidsSidecar,
  buildSchema: schema.buildSchema,
  validateBidsDataset: BIDS.validateBidsDataset,
  validateHedDataset: dataset.validateHedDataset,
  validateHedEvent: event.validateHedEvent,
  validateHedString: event.validateHedString,
}
