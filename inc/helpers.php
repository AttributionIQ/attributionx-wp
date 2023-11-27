<?php

defined('ABSPATH') || exit;

/**
 * Add attx fields to a gravity form.
 */
function attx_add_gf_form_fields($form)
{
  $attx_options = get_option("attx_options");
  $attx_form_fields = $attx_options["config"]["attx_form_fields"];

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
  foreach ($attx_form_fields as $key => $label) {

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

/**
 * Add attx fields to a QuForm.
 */
function attx_add_hidden_fields_to_quform($form)
{
  $attx_options = get_option("attx_options");
  $attx_form_fields = $attx_options["config"]["attx_form_fields"];

  $page = &$form['elements'][0];

  //Get all the attx fields which already been added.
  $added_attx_fields = [];
  foreach ($page['elements'] as $field) {
    if (isset($field["dynamicKey"]) && !empty($field["dynamicKey"])) {
      if (strpos($field["dynamicKey"], "attx") !== false) {
        $added_attx_fields[] = $field["dynamicKey"];
      }
    }
  }

  foreach ($attx_form_fields as $key => $label) {

    //Skip if the field already added
    if (in_array($key, $added_attx_fields)) {
      continue;
    }

    //Get default config for Hidden field
    $field = Quform_Element_Hidden::getDefaultConfig();

    //Add custom field configuration
    $field['label'] = $label;
    $field['dynamicDefaultValue'] = true;
    $field['dynamicKey'] = $key;
    $field['uniqueId'] = $key;

    //Increment next element ID and set it as the element ID, set parent and position
    $field['id'] = $form['nextElementId']++;
    $field['parentId'] = $page['id'];
    $field['position'] = count($page['elements']);

    //Add to the form
    $page['elements'][] = $field;
  }

  // Save the form
  $repository = quform('repository');
  $repository->save($form);
}

/**
 * Delete attx fields from a QuForm.
 */
function attx_delete_hidden_fields_quform($form)
{

  foreach ($form['elements'] as &$page) {
    foreach ($page['elements'] as $k => &$field) {
      if (isset($field["dynamicKey"]) && !empty($field["dynamicKey"])) {
        if (strpos($field["dynamicKey"], "attx") !== false) {
          unset($page['elements'][$k]);
        }
      }
    }
  }

  // Save the form
  $repository = quform('repository');
  $repository->save($form);
}

/**
 * Check if QuForm plugin is active.
 */
function is_quform_active()
{
  $active_plugins = (array) get_option('active_plugins', array());

  if (is_multisite()) {
    $active_plugins = array_merge($active_plugins, get_site_option('active_sitewide_plugins', array()));
  }

  return in_array('quform/quform.php', $active_plugins) || array_key_exists('quform/quform.php', $active_plugins);
}
