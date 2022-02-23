const gulp = require('gulp')
const {src, series, parallel, dest, watch} = require('gulp')
const concat = require('gulp-concat')
const terser = require('gulp-terser')
const sourcemaps = require('gulp-sourcemaps')

const jsPath ='public/js-prod/view/*.js'

function jsTask() {
    return src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
}

exports.jsTask = jsTask