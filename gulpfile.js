'use strict'

const gulp = require('gulp');
const babel = require('gulp-babel');
const webserver = require('gulp-webserver');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');


// Set the browser that you want to supoprt
const AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('webserver', function() {
  gulp.src('dist')
    .pipe(webserver({
      fallback: 'index.html'
    }));
});

// Gulp task to minify CSS files
gulp.task('styles', () => {
  return gulp.src('./src/sass/main.scss')
    // Compile SASS files
    .pipe(sass({
      outputStyle: 'nested',
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(gulp.dest('./dist/css'))
});

// Gulp task to minify JavaScript files
gulp.task('scripts', () => {
  return gulp.src('./src/js/**/*.js')
		.pipe(babel({
					presets: ['es2015']
				}))
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(gulp.dest('./dist/js'))
});

gulp.task('images', () => {
  return gulp.src('./src/img/*.{png,gif,jpg}')
    .pipe(gulp.dest('./dist/img'))
});

// Gulp task to minify HTML files
gulp.task('pages', () => {
  return gulp.src(['./src/**/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist'));
});

// Clean output directory
gulp.task('clean', () => del(['dist']));

gulp.task('watch', () => {
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/sass/**/*.scss', ['styles']);
	gulp.watch('src/img/*.{png,gif,jpg}', ['images']);
	gulp.watch('src/*.html', ['pages']);
});

gulp.task('default', ['clean'], () => {
	runSequence(
    'styles',
    'scripts',
		'images',
    'pages',
		'webserver',
		'watch'
  );
});
