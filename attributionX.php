<?php

/**
 * Plugin Name: Attribution X
 * Description: Discover the source of your leads. We make it easy to track the source of every lead, so you can see which campaigns and channels are truly driving results.
 * Version: 1.2.0
 * Author: Tiger Digital
 * Author URI: https://tigerdigital.co.uk
 */

defined('ABSPATH') || exit;

require_once "inc/config.php";
require_once "inc/helpers.php";
require_once "inc/plugin-scripts.php";
require_once "inc/admin/view/settings-page.php";
require_once "inc/db.php";
require_once "inc/gf-integration.php";

/**
 * Plugin activation tasks.
 */
register_activation_hook(__FILE__, 'attx_activation_function');
function attx_activation_function()
{

  /**
   * Run only if the Gravity Forms installed and activated.
   */
  if (!is_gf_active()) {
    return;
  }

  //Add attx hidden fields to all created gravity forms.
  $active_forms = GFAPI::get_forms();
  $inactive_forms = GFAPI::get_forms(false);
  $forms = array_merge($active_forms, $inactive_forms);

  foreach ($forms as $form) {
    attx_add_gf_form_fields($form);
  }
}

/**
 * Plugin deactivation tasks.
 */
register_deactivation_hook(__FILE__, 'attx_deactivation_function');
function attx_deactivation_function()
{

  /**
   * Run only if the Gravity Forms installed and activated.
   */
  if (!is_gf_active()) {
    return;
  }

  //Delete attx hidden fields from all created gravity forms.
  $active_forms = GFAPI::get_forms();
  $inactive_forms = GFAPI::get_forms(false);
  $forms = array_merge($active_forms, $inactive_forms);

  foreach ($forms as $form) {
    attx_delete_gf_form_fields($form);
  }
}
