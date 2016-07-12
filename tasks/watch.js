const gulp = require('gulp')
const gutil = require('gulp-util')
const watch = require('gulp-watch')
const { each } = require('lodash')

module.exports = (config) => {
  gulp.task('watch', () => {
    const watchStatic = () => {
      each(config.static.assets, (source) => {
        watch(source.source, source.tasks)
      })
    }

    each(config.watch, (item) => {
      if (item === 'static') {
        watchStatic()
      } else {
        gutil.log(`Watching ${item}`)
        watch(config[item].watchSource, item)
      }
    })
  })
}
