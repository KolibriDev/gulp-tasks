const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const gutil = require('gulp-util')

const handler = function (error) {
  if (error) {
    // eslint-disable-next-line prefer-rest-params
    notify.onError(error).apply(this, arguments)
    gutil.log(gutil.colors.red(`Error (${error.plugin}): ${error.message}`))
    gutil.log(gutil.colors.red(error.toString()))
  }
  this.emit('error')
}

handler.plumb = () => plumber({ errorHandler: handler })

module.exports = handler
