const gulp = require('gulp')
const del = require('del')

module.exports = (cfg) => {
  const task = () => del([cfg.target])

  gulp.task('clean', task)
  return task
}
