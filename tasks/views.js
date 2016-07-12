const gulp = require('gulp')
const pug = require('gulp-pug')
const errorHandler = require('../utils/error-handler')

module.exports = (config) => {
  gulp.task('views',
    () => gulp.src(config.views.source)
      .pipe(pug(config.views.options))
        .on('error', errorHandler)
      .pipe(gulp.dest(config.views.target))
  )
}
