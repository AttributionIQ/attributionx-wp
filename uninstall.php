<?php

defined('ABSPATH') || exit;

/**
 * If uninstall not called from WordPress, then exit.
 */
if (!defined('WP_UNINSTALL_PLUGIN')) {
  exit;
}

/**
 * Delete plugin options and data.
 */
delete_option('attx_options');
