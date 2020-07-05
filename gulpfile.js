const gulp = require("gulp");
const gulpZip = require("gulp-zip");

function bundle() {
  return gulp
    .src([
      "**/*", // This will zip everything
      "!node_modules/**",
      "!src/**",
      "!production zip/**",
      "!gulpfile.js",
      "!package.json",
      "!package-lock.json",
      "!webpack.config.js",
      "!.gitignore",
      "!README.md"
    ])
    .pipe(gulpZip("test-block-plugin.zip"))
    .pipe(gulp.dest("production zip"));
}

exports.bundle = bundle;
