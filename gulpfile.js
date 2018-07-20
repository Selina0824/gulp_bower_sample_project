const gulp       = require('gulp');
const jshint     = require('gulp-jshint');
const uglify     = require('gulp-uglify');
const concat     = require('gulp-concat');
const less       = require('gulp-less');
const prefix     = require('gulp-autoprefixer');
const cleanCss   = require('gulp-clean-css');
const del        = require('del');
const bSync = require('browser-sync');
const mainBowerFiles = require('main-bower-files');


gulp.task('test', () => {
    return gulp.src(['app/scripts/**/*.js', '!app/scripts/vendor/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('clean', () => {
    return del(['dist']);
});

gulp.task('scripts',
    gulp.series('test', function scriptsInternal() {
        let glob = mainBowerFiles('**/*.js');
        glob.push('./app/scripts/*.js');
        console.log(glob);
        return gulp.src(glob)
            .pipe(concat('main.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('dist/scripts'));
    })
);

gulp.task('styles', () => {
    return gulp.src('app/styles/main.less')
        .pipe(less())
        .pipe(cleanCss()) 
        .pipe(prefix())
        .pipe(gulp.dest('dist/styles'));
});

gulp.task('server',done => {
    bSync({
        server:{
            baseDir:['dist','app']
        }
    });
    done();
})

gulp.task('default',
    gulp.series('clean',
        gulp.parallel('styles', 'scripts'),
        'server',
        function watcher(done) {
            gulp.watch(
               ['app/scripts/**/*.js', '!app/scripts/vendor/**/*.js'],
               gulp.parallel('scripts')
            );
            gulp.watch(
                'app/styles/main.less',
                gulp.parallel('styles')
            );
            done();
        }
    )
)

// gulp.task('default',
//     gulp.series('clean',
//         gulp.parallel('styles', 'scripts'),
//     )
// )
