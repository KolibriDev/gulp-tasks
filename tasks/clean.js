const gulp = require('gulp')
const del = require('del')

module.exports = (cfg) => {
  gulp.task('clean', () => del([cfg.target]))
}
