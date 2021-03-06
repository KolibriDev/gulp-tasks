const gulp = require('gulp')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const errorHandler = require('../utils/error-handler')

module.exports = (config) => {
  const task = () => gulp.src(config.styles.source)
    .pipe(errorHandler.plumb())
    .pipe(sass(config.styles.options))
    .pipe(autoprefixer(config.styles.autoprefixer))
    .pipe(gulp.dest(config.styles.target))

  gulp.task('styles', task)
  return task
}
