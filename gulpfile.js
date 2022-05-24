const { 
    series,
    parallel,
    src,
    dest,
    task,
    watch,
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const combine = require('gulp-scss-combine');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const rename = require("gulp-rename");

task('join-scss', series(
    function () {
        return src('_files/scss/*.scss')
            .pipe(sourcemaps.init())
            .pipe(concat('production.scss'))
            .pipe(sass())
            .pipe(cleanCSS())
            .pipe(sourcemaps.write())
            .pipe(dest('assets'))
    }
))

task('join-js', series(
    function () {
        return src('_files/js/*.js')
            .pipe(sourcemaps.init())
            .pipe(concat('production.js'))
            .pipe(terser())
            .pipe(sourcemaps.write('.', {addComment: false}))
            .pipe(dest('assets'))
    }
))

task('watch-scss', series(
    function () {
        watch(
            [
                '_files/scss/*.scss'
            ],
            parallel('join-scss')
        )
    }
))

task('watch-js', series(
    function () {
        watch(
            [
                '_files/js/*.js'
            ],
            parallel('join-js')
        )
    }
))

exports.build = series(
    parallel(['join-scss', 'join-js']), 
    parallel(['watch-scss', 'watch-js'])
);
