<?php

/**
 * Plugin Name: Attribution X
 * Description: Discover the source of your leads. We make it easy to track the source of every lead, so you can see which campaigns and channels are truly driving results.
 * Version: 1.0.0
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

  add_action('wp_enqueue_scripts', 'attx_plugin_scripts');
  function attx_plugin_scripts()
  {

    wp_enqueue_script('attx-save-attributions-to-cookie-js', plugin_dir_url(__FILE__) . 'assets/js/scripts.min.js', array('jquery'), false, true);

  }

  require_once "inc/gf-integration.php";
}
