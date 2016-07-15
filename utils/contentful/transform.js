const _ = require('lodash')
const marked = require('marked')

module.exports = (entries, config) => {
  const makeSrcSet = (url) => {
    let srcSet = ''

    _.each(config.contentful.srcset, (size) => {
      srcSet += `${url}?w=${size} ${size}w,`
    })

    return srcSet.slice(0, -1)
  }

  const makeFavicons = (url) => {
    const sizes = []

    _.each(config.contentful.favicons, (size) => {
      sizes.push({
        size,
        url: `${url}?w=${size}`,
      })
    })

    return sizes
  }

  const processImage = (image) => ({
    url: image.fields.file.url,
    srcset: makeSrcSet(image.fields.file.url),
  })

  const processFavicon = (image) => ({
    url: image.fields.file.url,
    sizes: makeFavicons(image.fields.file.url),
  })

  const ret = {}
  entries.items.forEach((entry) => {
    const obj = {
      id: entry.sys.id,
      revision: entry.sys.revision,
    }

    _.each(entry.fields, (value, field) => {
      const isMarkdown = config.contentful.markdownContentTypes.indexOf(entry.sys.contentType.sys.id) !== -1 &&
                         config.contentful.markdownFields.indexOf(field) !== -1

      if (field === 'favicon') {
        obj.favicon = processFavicon(value)
      } else if (config.contentful.imageFields.indexOf(field) !== -1) {
        obj.image = processImage(value)
      } else if (isMarkdown) {
        obj[field] = marked(value)
      } else {
        obj[field] = value
      }
    })

    ret[entry.sys.contentType.sys.id] = ret[entry.sys.contentType.sys.id] || []
    ret[entry.sys.contentType.sys.id].push(obj)
  })
  return ret
}
