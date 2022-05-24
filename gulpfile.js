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
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
// ---------------------------------------------------
const browserify = require('browserify')
const babelify = require('babelify')
const source = require('vinyl-source-stream')
const rename = require("gulp-rename");
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require("gulp-uglify");
// const applySourceMap = require('vinyl-sourcemaps-apply');


var jsSRC       = "source/js/index.js";
var jsMinified  = "source/js/minified/";
var jsConcat    = jsMinified + "*.js"
var jsDIST      = "./assets/";
var jsWatch     = "source/js/**/*.js";
var jsWorkflowFiles = [
    jsSRC
];

// ---------------------------------------------------


task('join-scss', series(
    function () {
        return src('source/scss/*.scss')
            .pipe(sourcemaps.init())
            .pipe(concat('production.scss'))
            .pipe(sass())
            .pipe(cleanCSS())
            .pipe(sourcemaps.write('.', {addComment: false}))
            .pipe(dest('assets'))
    }
))

// task('js', series(
//     function () {
//         return src('source/js/*.js')
//             .pipe(sourcemaps.init())
//             .pipe(concat('production.js'))
//             .pipe(terser())
//             .pipe(sourcemaps.write('.', {addComment: false}))
//             .pipe(dest('assets'))
//     }
// ))

task(
    'js',
    function (done) {
        jsWorkflowFiles.map(
            function (entry) {
                return browserify({
                    entries: [entry]
                })
                .transform(
                    babelify, {
                        presets: ["@babel/preset-env"]
                    }
                )
                .bundle()
                .pipe(source(entry))
                // .pipe(rename({
                //     extname: '.min.js'
                // }))
                .pipe(rename(function (path) {
                    path.dirname = '';
                    path.extname = '.min.js';
                }))
                .pipe(buffer())
                .pipe(sourcemaps.init({
                    loadMaps: true
                }))
                .pipe(uglify())
                .pipe(sourcemaps.write('./'))
                .pipe(dest(jsDIST))
            }
        )
        done()
    }
)

task('watch-js', series(
    function () {
        watch(
            jsWatch,
            parallel('js')
        )
    }
))

// task(
//     'join-minified-js',
//     function () {
//         return src(jsConcat)
//             .pipe(concat('production.min.js'))
//             .pipe(uglify())
//             .pipe(rename(function (path) {
//                 path.dirname = '';
//             }))
//             .pipe(dest(jsDIST))
//     }
// )

// task(
//     'cycle-js',
//     series([
//         'js',
//         'join-minified-js'
//     ])
// )

task('watch-scss', series(
    function () {
        watch(
            [
                'source/scss/*.scss'
            ],
            parallel('join-scss')
        )
    }
))

// task('watch-js', series(
//     function () {
//         watch(
//             [
//                 'source/js/*.js'
//             ],
//             parallel('js')
//         )
//     }
// ))

exports.build = series(
    parallel(['join-scss', 'js']), 
    parallel(['watch-scss', 'watch-js'])
);
