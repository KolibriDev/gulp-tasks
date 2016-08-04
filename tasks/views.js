const gulp = require('gulp')
const gutil = require('gulp-util')
const pug = require('gulp-pug')
const errorHandler = require('../utils/error-handler')
const utils = require('../utils/views')
const contentful = require('@kolibridev/contentful')

module.exports = (config) => {
  config.views.options.locals.utils = utils

  const taskDefault = () => gulp.src(config.views.source)
    .pipe(pug(config.views.options))
    .on('error', errorHandler)
    .pipe(gulp.dest(config.views.target))

  // An alternative task that uses the Contentful API to inject data into the pug compile
  const taskContent = (done) => {
    if (config.views.content === 'contentful') {
      config.contentful.env = config.env
      contentful(config.contentful).then((data) => {
        gutil.log('Content received!')
        config.views.options.locals.contentful = config.contentful.parse(data)
        gulp.src(config.views.source)
        .pipe(pug(config.views.options))
        .on('error', errorHandler)
        .pipe(gulp.dest(config.views.target))
        done()
      }).catch((err) => {
        gutil.log('Content failed!')
        console.log(err)
        done()
      })
    } else {
      taskDefault(done)
    }
  }

  const task = config.views.content ? taskContent : taskDefault
  gulp.task('views', task)
  return task
}
