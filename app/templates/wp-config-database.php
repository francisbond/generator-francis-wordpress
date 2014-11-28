<?php

/**
 * Database Configuration
 */

/** Define site host */
if (isset($_SERVER['X_FORWARDED_HOST']) && !empty($_SERVER['X_FORWARDED_HOST'])) {
  $hostname = $_SERVER['X_FORWARDED_HOST'];
} else {
  $hostname = $_SERVER['HTTP_HOST'];
}

/** Set environment based on hostname */
switch ($hostname) {
  case '<%= _.slugify(slug) %>.craft.dev':
    /** The name of the database for WordPress */
    define('DB_NAME', '<%= _.slugify(slug) %>');

    /** MySQL database username */
    define('DB_USER', 'root');

    /** MySQL database password */
    define('DB_PASSWORD', 'root');

    /** MySQL hostname */
    define('DB_HOST', 'localhost');

    break;

  default:
    /** The name of the database for WordPress */
    define('DB_NAME', getenv('DB_NAME'));

    /** MySQL database username */
    define('DB_USER', getenv('DB_USER'));

    /** MySQL database password */
    define('DB_PASSWORD', getenv('DB_PASSWORD'));

    /** MySQL hostname */
    define('DB_HOST', getenv('DB_HOST').':'.getenv('DB_PORT'));
}

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/** Are we in SSL mode? */
if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') {
  $protocol = 'https://';
} else {
  $protocol = 'http://';
}

/** Define WordPress Site URLs */
define('WP_SITEURL', $protocol . rtrim($hostname, '/'));
define('WP_HOME', $protocol . rtrim($hostname, '/'));

/** Clean up */
unset($hostname, $protocol);