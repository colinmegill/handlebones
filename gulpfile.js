var gulp = require("gulp"),
  mocha = require("gulp-mocha"),
  jshint = require("gulp-jshint"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  clean = require("gulp-clean"),
  connect = require("gulp-connect");

gulp.task("mocha", ["connect", "dist"], function () {
  var exec = require("child_process").exec,
    cmd = "mocha-phantomjs http://localhost:8080/native.html",
    child = exec(cmd, function (error, stdout, stderr) {
      if (error) {
        throw error;
      }
      if (stdout) {
        process.stdout.write(stdout);
      }
      if (stderr) {
        process.stderr.write(stderr);
      }
      process.exit();
    });
});

gulp.task("connect", connect.server({
  root: ["test", "bower_components", __dirname],
  livereload: false,
  port: 8080
}));

gulp.task("dist", ["move-map"], function () {
  return gulp.src("./dist", {
    read: false
  }).pipe(clean({
    force: true
  }));
});

gulp.task("compress", function() {
  return gulp.src("./handlebones.js")
    .pipe(uglify({
      outSourceMap: true
    }))
    .pipe(gulp.dest("./dist"));
});

gulp.task("move-dist", ["compress"], function () {
  return gulp.src("./dist/handlebones.js")
    .pipe(rename("handlebones.min.js"))
    .pipe(gulp.dest("."));
});

gulp.task("move-map", ["move-dist"], function () {
  return gulp.src("./dist/handlebones.js.map")
    .pipe(gulp.dest("."));
});

gulp.task("lint", function() {
  return gulp.src("./handlebones.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"));
});


gulp.task("default", ["lint", "mocha", "dist"]);