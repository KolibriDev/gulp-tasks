const gulp = require('gulp')
const gutil = require('gulp-util')
const eslint = require('gulp-eslint')
const browserify = require('browserify')
const babelify = require('babelify')
const uglify = require('gulp-uglify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const errorHandler = require('../utils/error-handler')

module.exports = function (config) {
  gulp.task('lint-scripts',
    () => gulp.src(config.scripts.source)
      .pipe(errorHandler.plumb())
      .pipe(eslint())
      .pipe(eslint.format())
      // .pipe(eslint.failAfterError())
  )

  gulp.task('scripts', ['lint-scripts'],
    () => browserify(config.scripts.browserify)
      .transform(babelify)
      .bundle()
      .on('error', errorHandler)
      .pipe(source('main.js'))
      .pipe(buffer())
      .pipe(config.minify ? uglify({ preserveComments: config.scripts.preserveComments }) : gutil.noop())
      .pipe(gulp.dest(config.scripts.target))
  )
}
