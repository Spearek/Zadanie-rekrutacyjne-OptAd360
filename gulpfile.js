const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');

function style() {
    return gulp.src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 3 versions'))
    .pipe(gulp.dest('compiled/css'))
}

function compileJS() {
    return gulp.src('./src/scripts/**/*.js')
    .pipe(babel({
        presets: [
          ['@babel/env', {
            modules: false
          }]
        ]
    }))
    .pipe(gulp.dest('compiled/js'))
}

exports.style = style;
exports.compile = compileJS;
