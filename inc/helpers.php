<?php

defined('ABSPATH') || exit;

/**
 * Add attx fields to a gravity form.
 */
function attx_add_gf_form_fields($form)
{
  $attx_options = json_decode(get_option("attx_options"), true);
  $gf_attx_fields = $attx_options["config"]["gf_attx_fields"];

  //Get the highest ID of form fields 
  //to determine the new fields' IDs.
  $new_field_id = 0;
  foreach ($form['fields'] as $field) {
    if ($field->id > $new_field_id) {
      $new_field_id = $field->id;
    }
  }

  //Get all the attx fields which already been added.
  $added_attx_fields = [];
  foreach ($form['fields'] as $field) {
    if (strpos($field->inputName, "attx") !== false) {
      $added_attx_fields[] = $field->inputName;
    }
  }

  //Add fields.
  foreach ($gf_attx_fields as $key => $label) {

    //Skip if the field already added.
    if (in_array($key, $added_attx_fields)) {
      continue;
    }

    $new_field_id++;

    $properties['type'] = 'hidden';

    $new_field = GF_Fields::create($properties);

    $new_field->id = $new_field_id;
    $new_field->label = $label;
    $new_field->inputName = $key;
    $new_field->allowsPrepopulate = true;

    $form['fields'][] = $new_field;
  }

  GFAPI::update_form($form);
}

/**
 * Delete attx fields from a gravity form.
 */
function attx_delete_gf_form_fields($form)
{
  foreach ($form['fields'] as $k => $field) {
    if (strpos($field->inputName, "attx") !== false) {
      unset($form['fields'][$k]);
    }
  }

  GFAPI::update_form($form);
}

/**
 * Check if Gravity Forms plugin is active.
 */
function is_gf_active()
{
  $active_plugins = (array) get_option('active_plugins', array());

  if (is_multisite()) {
    $active_plugins = array_merge($active_plugins, get_site_option('active_sitewide_plugins', array()));
  }

  return in_array('gravityforms/gravityforms.php', $active_plugins) || array_key_exists('gravityforms/gravityforms.php', $active_plugins);
}
