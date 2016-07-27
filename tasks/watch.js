const gulp = require('gulp')
const gutil = require('gulp-util')
const watch = require('gulp-watch')
const { each } = require('lodash')

module.exports = (config) => {
  const task = () => {
    const watchStatic = () => {
      each(config.static.assets, (source, key) => {
        gutil.log(`Watching ${key}`)
        watch(source.source, () => gulp.start(source.tasks))
      })
    }

    each(config.watch, (item) => {
      if (item === 'static') {
        watchStatic()
      } else {
        gutil.log(`Watching ${item}`)
        watch(config[item].watchSource, () => gulp.start(config[item].watchTasks))
      }
    })
  }

  gulp.task('watch', task)
  return task
}
