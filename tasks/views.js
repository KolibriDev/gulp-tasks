const gulp = require('gulp')
const gutil = require('gulp-util')
const pug = require('gulp-pug')
const errorHandler = require('../utils/error-handler')
const contentful = require('../utils/contentful')

module.exports = (config) => {
  gulp.task('views',
    () => gulp.src(config.views.source)
      .pipe(pug(config.views.options))
        .on('error', errorHandler)
      .pipe(gulp.dest(config.views.target))
  )

  // An alternative task that uses the Contentful API to inject data into the pug compile
  gulp.task('views-contentful', (done) => {
    contentful(config).then((data) => {
      config.views.options.locals.contentful = data
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
  })
}
