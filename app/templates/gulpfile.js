// Generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>
'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    minimist = require('minimist');

var knownOptions = {
  string: 'env',
  default: { env: process.env.NODE_ENV || 'staging' }
};

var options = minimist(process.argv.slice(2), knownOptions);

/**
 * gulp deploy-init
 */
gulp.task('deploy-init', function() {
  var server = options.env === 'production'
    ? '<%= remoteProduction %>'
    : '<%= remoteStaging %>';

  var branch = options.env === 'production'
    ? 'dokku-production'
    : 'dokku-staging';

  var slug = '<%= _.slugify(slug) %>';

  return gulp.src('')
    .pipe($.shell([
      'git remote add ' + branch + ' dokku@' + server + ':' + slug,
      'git push ' + branch + ' master',
      'ssh dokku@' + server + ' mariadb:create ' + slug,
      'ssh dokku@' + server + ' mariadb:link ' + slug + ' ' + slug + ''
    ]));
});

/**
 * gulp deploy
 */
gulp.task('deploy', function() {
  var branch = options.env === 'production'
    ? 'dokku-production'
    : 'dokku-staging';

  return gulp.src('')
    .pipe($.shell([
      'git push ',
      'git push ' + branch + ' master'
    ]));
});

/**
 * gulp db-dump-local
 */
gulp.task('db-dump-local', function() {
  var slug = '<%= _.slugify(slug) %>';

  return gulp.src('')
    .pipe($.shell([
      '[ -d ".tmp" ] || mkdir .tmp',
      'vagrant ssh --command "mysqldump -uroot -proot ' + slug + ' > /vagrant/.tmp/local.sql"'
    ]));
});

/**
 * gulp db-dump-remote
 */
gulp.task('db-dump-remote', function() {
  var server = options.env === 'production'
    ? '<%= remoteProduction %>'
    : '<%= remoteStaging %>';

  var file = options.env === 'production'
    ? 'remote--production.sql'
    : 'remote--staging.sql';

  var slug = '<%= _.slugify(slug) %>';

  return gulp.src('')
    .pipe($.shell([
      '[ -d ".tmp" ] || mkdir .tmp',
      'ssh dokku@' + server + ' mariadb:dumpraw ' + slug + ' | tee .tmp/' + file + ' > /dev/null'
    ]));
});

/**
 * gulp db-push
 */
gulp.task('db-push', function() {
  var server = options.env === 'production'
    ? '<%= remoteProduction %>'
    : '<%= remoteStaging %>';

  var slug = '<%= _.slugify(slug) %>';

  return gulp.src('')
    .pipe($.shell([
      'ssh dokku@' + server + ' mariadb:console ' + slug + ' < .tmp/local.sql'
    ]));
});

/**
 * gulp db-pull
 */
gulp.task('db-pull', function(){
  var file = options.env === 'production'
    ? 'remote--production.sql'
    : 'remote--staging.sql';

  var slug = '<%= _.slugify(slug) %>';

   return gulp.src('')
    .pipe($.shell([
      'vagrant ssh --command "mysql -uroot -proot ' + slug + ' < /vagrant/.tmp/' + file + '"'
    ]));
});

/**
 * gulp db-dump
 */
gulp.task('db-dump', [
    'db-dump-local',
    'db-dump-remote'
  ], function() {
    var file = options.env === 'production'
      ? 'remote--production.sql'
      : 'remote--staging.sql';

    return gulp.src([
        '.tmp/local.sql',
        '.tmp/ ' + file
      ])
      .pipe(gulp.dest('databases'));
});
