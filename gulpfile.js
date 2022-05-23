const { 
    parallel,
    src,
    dest,
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const combine = require('gulp-scss-combine');
const concat = require('gulp-concat');

function JOIN_SASS() {
    return src('assets/scss/*.scss')
        .pipe(combine())
        .pipe(concat('production.scss'))
        .pipe(sass())
        .pipe(dest('assets'))
}

exports.build = parallel(JOIN_SASS);