const gulp = require('gulp')
const errorHandler = require('../utils/error-handler')
const eslint = require('gulp-eslint')
// const pugLint = require('gulp-pug-lint')

module.exports = function (cfg) {
  gulp.task('lint-scripts',
    () => gulp.src(cfg.scripts.src)
      .pipe(errorHandler.plumb())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  )

  // gulp.task('lint-views',
  //   () => gulp.src(cfg.views.src)
  //     .pipe(errorHandler.plumb())
  //
  //     .pipe(debug({ title: '--lint-view:' }))
  //     .pipe(pugLint())
  // )
}
