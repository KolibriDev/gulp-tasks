const gulp = require('gulp')
const runSequence = require('run-sequence')

gulp.task('build',
  (done) => runSequence('scripts', 'styles', 'views', 'static', done)
)

gulp.task('rebuild', ['clean'],
  (done) => runSequence('build', done)
)
