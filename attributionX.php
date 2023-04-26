<?php

/**
 * Plugin Name: Attribution X
 * Description: Discover the source of your leads. We make it easy to track the source of every lead, so you can see which campaigns and channels are truly driving results.
 * Version: 1.2.0
 * Author: Tiger Digital
 * Author URI: https://tigerdigital.co.uk
 */

defined('ABSPATH') || exit;

/**
 * Run only if the Gravity Forms installed and activated.
 */
add_action('gform_loaded', 'attx_add_gf_hooks', 10, 0);
function attx_add_gf_hooks()
{
  require_once "inc/plugin-scripts.php";
  require_once "inc/admin/view/settings-page.php";
  require_once "inc/db.php";
  require_once "inc/gf-integration.php";
}
