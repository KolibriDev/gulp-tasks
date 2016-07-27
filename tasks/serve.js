const gulp = require('gulp')
const browserSync = require('browser-sync').create()

module.exports = (cfg) => {
  const task = () => {
    browserSync.init(cfg.server)

    gulp.start('watch')
  }

  gulp.task('serve', ['build'], task)
  return task
}
