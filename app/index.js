'use strict';

var yeoman = require('yeoman-generator'),
    yosay = require('yosay');

var FrancisWordpressGenerator = yeoman.generators.Base.extend({
  init: function() {
    this.pkg = require('../package.json');
  },

  promptTask: function() {
    var done = this.async();

    this.log(yosay('You\'re using Francis Bond\'s fantastic Wordpress generator.'));

    this.prompt([{
      name: 'slug',
      message: 'Enter a unique slug for this project',
    }, {
      name: 'staging',
      message: 'Enter the hostname of the dokku staging server',
      default: 'staging.francisbond.com'
    },
    {
      name: 'production',
      message: 'Enter the hostname of the dokku production server',
      default: 'wp.francisbond.com'
    }], function(props) {
      this.slug = props.slug;
      this.remoteStaging = props.staging;
      this.remoteProduction = props.production;

      done();
    }.bind(this));
  },

  gulp: function() {
    this.template('gulpfile.js', 'gulpfile.js');
  },

  git: function() {
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
  },

  package: function() {
    this.copy('_package.json', 'package.json');
  },

  composer: function() {
    this.copy('_composer.json', 'composer.json');
    this.copy('_composer.lock', 'composer.lock');
  },

  extras: function() {
    this.copy('editorconfig', '.editorconfig');
    this.copy('env', '.env');
    this.copy('Procfile', 'Procfile');
  },

  vagrant: function() {
    this.copy('Vagrantfile', 'Vagrantfile');
  },

  puppet: function() {
    this.directory('puppet', 'puppet');
  },

  public: function() {
    this.mkdir('public');
    this.copy('wp-config-database.php', 'public/wp-config-database.php');
    this.write('public/.gitkeep', '');

    this.copy('htaccess', 'public/.htaccess');
  },

  install: function() {
    this.installDependencies();
  }
});

module.exports = FrancisWordpressGenerator;
