const gulp = require('gulp')
const runSequence = require('run-sequence')

module.exports = (config) => {
  gulp.task('build',
    (done) => runSequence(config.build.tasks, done)
  )

  gulp.task('rebuild', ['clean'],
    (done) => runSequence('build', done)
  )
}
