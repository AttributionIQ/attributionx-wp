// Defining base pathes
var basePaths = {
    js: './assets/js/',
    css: './assets/css/',
    img: './assets/img/',
    node: './node_modules/',
    dev: './src/'
};

// Defining requirements
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var merge2 = require('merge2');
var imagemin = require('gulp-imagemin');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var clone = require('gulp-clone');
var merge = require('gulp-merge');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var cleanCSS = require('gulp-clean-css');

function swallowError(self, error) {
    console.log(error.toString())

    self.emit('end')
}

// Run:
// gulp sass
// Compiles SCSS files in CSS
gulp.task('sass', function () {
    var stream = gulp.src(basePaths.dev + 'sass/*.scss')
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(concat('style.css'))
        .pipe(gulp.dest(basePaths.css))
    return stream;
});


// Run:
// gulp imagemin
// Running image optimizing task
gulp.task('imagemin', function () {
    return gulp.src(basePaths.dev + 'images/**')
        .pipe(imagemin())
        .pipe(gulp.dest(basePaths.img))
});

// Run:
// gulp nanocss
// Minifies CSS files
gulp.task('cleancss', function () {
    return gulp.src(basePaths.css + '*.min.css', { read: false }) // much faster
        .pipe(ignore('style.css'))
        .pipe(rimraf());
});

gulp.task('minify-css', function () {
    return gulp.src(basePaths.css + 'style.css')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(cleanCSS({ compatibility: '*' }))
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(basePaths.css));
});

gulp.task('styles', gulp.series('sass', 'minify-css'));

// Run:
// gulp scripts.
// Uglifies and concat all JS files into one
gulp.task('scripts', function () {

    return gulp.src(basePaths.dev + 'js/**/*.js')
        .pipe(concat('scripts.min.js'))
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(gulp.dest(basePaths.js));

});

// Run:
// gulp watch
// Starts watcher. Watcher runs gulp sass task on changes
gulp.task('watch', function () {
    gulp.watch(basePaths.dev + 'sass/**/*.scss', gulp.series(['styles', 'dist']));
    gulp.watch(basePaths.dev + 'js/**/*.js', gulp.series(['scripts', 'dist']));

    //Inside the watch task.
    gulp.watch(basePaths.img + '**', gulp.series(['imagemin', 'dist']))
});

// Deleting any file inside the /dist folder
gulp.task('clean-dist', function () {
    return del(['dist/**/*',]);
});

// Run
// gulp dist
// Copies the files to the /dist folder for distributon
gulp.task('dist', gulp.series('clean-dist', function () {
    return gulp.src(
        [
            './**/*',
            '!./.vscode',
            '!./dist/**',
            '!./node_modules/**',
            '!./src/**',
            '!./.gitignore',
            '!./gulpfile.js',
            '!./package-lock.json',
            '!./package.json',
        ]
    )
        .pipe(gulp.dest('dist'))
}));

