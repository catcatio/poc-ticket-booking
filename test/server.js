require('dotenv/config')
const config = require('../src/event/config')

module.exports = (masterAsset) => {
  config.liveDataStore = true
  config.masterIssuerKey = masterAsset.masterIssuerKey
  config.masterDistributorKey = masterAsset.masterDistributorKey
  config.masterAsset = masterAsset.asset
  // if (!config.liveDataStore) {
  //   config.masterIssuerKey = masterAsset.masterIssuerKey
  //   config.masterDistributorKey = masterAsset.masterDistributorKey
  //   config.masterAsset = masterAsset.asset
  // }

  const server = require('../src/event/server')(config)

  return {
    start: () => {
      return server.start()
    },
    stop: () => {
      return server.stop()
    },
    getConfig: () => {
      return config
    }
  }
}