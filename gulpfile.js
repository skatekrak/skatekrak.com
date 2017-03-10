const gulp = require("gulp");
const newer = require('gulp-newer');
const uglify = require("gulp-uglify");
const htmlclean = require('gulp-htmlclean');
const concat = require('gulp-concat');
const cssnano = require("gulp-cssnano");

gulp.task('html', () => {
    return gulp.src("./views/*")
        .pipe(htmlclean())
        .pipe(gulp.dest("./build/html"));
});

gulp.task("js", () => {
    return gulp.src("./assets/custom/js/*")
        .pipe(concat("main.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./build/js/"));
});

gulp.task("css", () => {
    return gulp.src("./assets/custom/css/*.css")
        .pipe(cssnano())
        .pipe(gulp.dest("./build/css/"));
});

gulp.task("default", ["html", "js", "css"]);