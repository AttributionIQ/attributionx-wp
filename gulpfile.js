// Defining base pathes
var basePaths = {
    js: './assets/js/',
    css: './assets/css/',
    img: './assets/img/',
    node: './node_modules/',
    dev: './src/'
};

// Defining requirements
import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import babel from 'gulp-babel';
import babelify from 'babelify';
import plumber from 'gulp-plumber';
import sass from 'gulp-sass';
import watch from 'gulp-watch';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import merge2 from 'merge2';
import imagemin from 'gulp-imagemin';
import ignore from 'gulp-ignore';
import rimraf from 'gulp-rimraf';
import clone from 'gulp-clone';
import merge from 'gulp-merge';
import sourcemaps from 'gulp-sourcemaps';
import del from 'del';
import cleanCSS from 'gulp-clean-css';

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
// Concat all JS files into one
gulp.task('scripts', function () {

    return gulp.src([
        basePaths.dev + 'js/helpers.js',
        basePaths.dev + 'js/fp.js',
        basePaths.dev + 'js/**/*.js',
        '!' + basePaths.dev + 'js/bundle.js',
    ])
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(basePaths.dev + 'js'));

});

// Run:
// gulp browserify
// Browserify task that will bundle and uglifies our JS files together
gulp.task('browserify', function () {
    return browserify(
        {
            entries: basePaths.dev + 'js/bundle.js',
            transform: [
                babelify.configure({
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-transform-runtime']
                })
            ]
        })
        .bundle()
        .pipe(source('scripts.min.js'))
        .pipe(buffer())
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
    gulp.watch([basePaths.dev + 'js/**/*.js', '!' + basePaths.dev + 'js/bundle.js'], gulp.series(['scripts', 'browserify', 'dist']));

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
            '!./supabase/**',
            '!./tests/**',
            '!./.gitignore',
            '!./gulpfile.js',
            '!./package-lock.json',
            '!./package.json',
            '!./attributionX.code-workspace',
        ]
    )
        .pipe(gulp.dest('dist/attributionX'))
}));

