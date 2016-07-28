const _ = require('lodash')
const marked = require('marked')
const moment = require('moment')
const numeral = require('numeral')

module.exports = (entries, config) => {
  const ret = {}

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

  const processNumberFields = (number) => {
    numeral.language('is', {
      delimiters: {
        thousands: '.',
        decimal: ',',
      },
    })
    numeral.language('is')

    return {
      is: (number < 999) ? number : numeral(number).format('0,0'),
    }
  }

  const processSplitTags = (splitTags) => {
    const obj = {}
    _.each(splitTags, (tag) => {
      const key = tag.split(':')[0]
      const value = tag.split(':')[1]
      obj[key] = value
    })
    return obj
  }

  const processDateTime = (datetime) => {
    const date = moment(datetime)

    return {
      month: date.format('MMMM'),
      monthshort: date.format('MMM'),
      day: date.format('D'),
      dayo: date.format('Do'),
      dayOfWeekShort: date.format('ddd'),
      dayOfWeek: date.format('dddd'),
      year: date.format('YYYY'),
      time: date.format('H:mm'),
    }
  }

  const processImage = (image) => ({
    url: image.fields.file.url,
    srcset: makeSrcSet(image.fields.file.url),
  })

  const processFavicon = (image) => ({
    url: image.fields.file.url,
    sizes: makeFavicons(image.fields.file.url),
  })

  const processEntry = (entry) => {
    if (typeof entry === 'string') {
      return entry
    }
    const obj = {
      id: entry.sys.id,
      revision: entry.sys.revision,
    }

    _.each(entry.fields, (value, field) => {
      const isMarkdown = config.contentful.markdownContentTypes.indexOf(entry.sys.contentType.sys.id) !== -1 &&
                         config.contentful.markdownFields.indexOf(field) !== -1

      if (field === 'favicon') {
        obj.favicon = processFavicon(value)
      } else if (config.contentful.datetimeFields.indexOf(field) !== -1) {
        obj[field] = processDateTime(value)
      } else if (config.contentful.imageFields.indexOf(field) !== -1) {
        obj[field] = processImage(value)
      } else if (config.contentful.splitTagFields.indexOf(field) !== -1) {
        obj[field] = processSplitTags(value)
      } else if (config.contentful.numberFields.indexOf(field) !== -1) {
        obj[field] = processNumberFields(value)
      } else if (isMarkdown) {
        obj[field] = marked(value)
      } else if (Array.isArray(value)) {
        obj[field] = []
        _.each(value, (subItem) => {
          obj[field].push(processEntry(subItem))
        })
      } else if (value.hasOwnProperty('sys')) {
        obj[field] = processEntry(value)
      } else {
        obj[field] = value
      }
    })
    return obj
  }

  entries.items.forEach((entry) => {
    ret[entry.sys.contentType.sys.id] = ret[entry.sys.contentType.sys.id] || []
    ret[entry.sys.contentType.sys.id].push(processEntry(entry))
  })

  return ret
}
