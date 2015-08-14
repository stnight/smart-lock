var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    coffee = require('gulp-coffee'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css');
// convert coffee to js
gulp.task('js', function () {
    gulp.src('prepros/coffee/*.coffee')
        .pipe(coffee({bare: true})).on('error', gutil.log)
        .pipe(uglify())
        .pipe(gulp.dest('js/'))
});
// convert scss to css
gulp.task('css', function () {
    gulp.src('prepros/scss/*.scss')
        .pipe(sass())
        .pipe(minifyCss())
        .pipe(gulp.dest('css/'))
});
// default
gulp.task('default', function(){
    gulp.watch('prepros/coffee/*.coffee', function () {
        gulp.start('js');
    });
    gulp.watch('prepros/scss/*.scss', function () {
        gulp.start('css');
    });
});