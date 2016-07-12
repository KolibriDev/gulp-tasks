const gulp = require('gulp')
const browserSync = require('browser-sync').create()

module.exports = (cfg) => {
  gulp.task('serve', ['build'], () => {
    browserSync.init(cfg.server)

    gulp.start('watch')
  })
}
