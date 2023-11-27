<?php

/**
 * Plugin Name: Attribution X
 * Description: Discover the source of your leads. We make it easy to track the source of every lead, so you can see which campaigns and channels are truly driving results.
 * Version: 1.3.0
 * Author: Tiger Digital
 * Author URI: https://tigerdigital.co.uk
 */

defined('ABSPATH') || exit;

require_once "inc/config.php";
require_once "inc/helpers.php";
require_once "inc/plugin-scripts.php";
require_once "inc/admin/view/settings-page.php";
require_once "inc/db.php";
require_once "inc/gforms.php";
require_once "inc/quform.php";

/**
 * Plugin activation tasks.
 */
register_activation_hook(__FILE__, 'attx_activation_function');
function attx_activation_function()
{

  /**
   * Add attx hidden fields to all created gravity forms.
   */
  if (is_gf_active()) {
    $active_forms = GFAPI::get_forms();
    $inactive_forms = GFAPI::get_forms(false);
    $forms = array_merge($active_forms, $inactive_forms);

    foreach ($forms as $form) {
      attx_add_gf_form_fields($form);
    }
  }

  /**
   * Add attx hidden fields to all created QuForms.
   */
  if (is_quform_active()) {
    $repository = quform('repository');
    $quforms = $repository->allForms();

    foreach ($quforms as $quform) {
      attx_add_hidden_fields_to_quform($quform);
    }
  }
}

/**
 * Plugin deactivation tasks.
 */
register_deactivation_hook(__FILE__, 'attx_deactivation_function');
function attx_deactivation_function()
{

  /**
   * Delete attx hidden fields from all created gravity forms.
   */
  if (is_gf_active()) {
    $active_forms = GFAPI::get_forms();
    $inactive_forms = GFAPI::get_forms(false);
    $forms = array_merge($active_forms, $inactive_forms);

    foreach ($forms as $form) {
      attx_delete_gf_form_fields($form);
    }
  }

  /**
   * Delete attx hidden fields from all created QuForms.
   */
  if (is_quform_active()) {
    $repository = quform('repository');
    $quforms = $repository->allForms();

    foreach ($quforms as $quform) {
      attx_delete_hidden_fields_quform($quform);
    }
  }
}
