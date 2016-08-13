const gulp = require('gulp')
const gif = require('gulp-if')
const eslint = require('gulp-eslint')
const browserify = require('browserify')
const babelify = require('babelify')
const uglify = require('gulp-uglify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const errorHandler = require('../utils/error-handler')

module.exports = function (config) {
  const lintTask = () => gulp.src(config.scripts.source)
    .pipe(errorHandler.plumb())
    .pipe(eslint())
    .pipe(eslint.format())
    // .pipe(eslint.failAfterError())

  const task = () => browserify(config.scripts.browserify)
    .transform(babelify)
    .bundle()
    .on('error', errorHandler)
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gif(config.minify, uglify(config.scripts.uglify)))
    .pipe(gulp.dest(config.scripts.target))

  gulp.task('lint-scripts', lintTask)
  gulp.task('scripts', ['lint-scripts'], task)

  return [task, lintTask]
}
