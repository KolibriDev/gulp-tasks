const contentful = require('contentful')
const transform = require('./transform')

module.exports = (config) => {
  const client = contentful.createClient(config.contentful.client)

  return new Promise((resolve, reject) => {
    client.getEntries()
      .then((entries) => resolve(transform(entries, config)))
      .catch((err) => reject(err))
  })
}
