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

task('join-scss', series(
    function () {
        return src('assets/scss/*.scss')
            .pipe(sourcemaps.init())
            .pipe(concat('production.scss'))
            .pipe(sass())
            .pipe(cleanCSS())
            .pipe(sourcemaps.write())
            .pipe(dest('assets'))
    }
))

task('watch', series(
    function () {
        watch(
            [
                'assets/scss/*.scss'
            ],
            parallel('join-scss')
        )
    }
))

exports.build = series(['join-scss', 'watch']);
