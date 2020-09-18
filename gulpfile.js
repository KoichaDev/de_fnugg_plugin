const gulp = require('gulp');
const gulpZip = require('gulp-zip');

function bundle() {
  return gulp
    .src([
      '**/*', // This will zip everything
      '!node_modules/**',
      '!src/**',
      '!production-ready/**',
      '!gulpfile.js',
      '!package.json',
      '!package-lock.json',
      '!webpack.config.js',
      '!.gitignore',
      '!README.md',
    ])
    .pipe(gulpZip('fnugg.zip'))
    .pipe(gulp.dest('production-ready'));
}

exports.bundle = bundle;
