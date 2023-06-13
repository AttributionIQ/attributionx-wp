<?php

defined('ABSPATH') || exit;

/**
 * Run only if the Gravity Forms installed and activated.
 */
if (!is_gf_active()) {
   return;
}

/**
 * Save attributions to a gravity form.
 */
add_action('gform_pre_submission', 'attx_gform_pre_submission_handler');
function attx_gform_pre_submission_handler($form)
{

   //Get data.
   if (isset($_POST["attx"])) {
      $storage = json_decode(stripslashes($_POST["attx"]), true);
      $storage = (array) end($storage);
   } else {
      $storage = [];
   }

   //Delete unused data.
   unset($storage["visitorIds"]["IP"]);

   //Populate fields.
   if (isset($form["fields"]) && is_array($form["fields"])) {

      $attx_options = get_option("attx_options");
      $gf_attx_fields = $attx_options["config"]["gf_attx_fields"];

      foreach ($form["fields"] as $field) {

         if (
            isset($gf_attx_fields[$field["inputName"]]) &&
            $field["inputName"] !== "attx_visitor_ids" &&
            $field["inputName"] !== "attx_referer"
         ) {
            $slug = str_replace("attx_", "", $field["inputName"]);
            $_POST['input_' . $field["id"]] =  isset($storage["attribution"][$slug]) ? $storage["attribution"][$slug] : "";
         } else if (isset($gf_attx_fields[$field["inputName"]]) && $field["inputName"] === "attx_visitor_ids") {
            $_POST['input_' . $field["id"]] =  isset($storage["visitorIds"]) ? json_encode($storage["visitorIds"]) : "";
         } else if (isset($gf_attx_fields[$field["inputName"]]) && $field["inputName"] === "attx_referer") {
            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["ref"]) ? urldecode($storage["attribution"]["ref"]) : "";
         }
      }
   }
}

/**
 * Add attx hidden fields to a new gravity form.
 */
add_action('gform_after_save_form', 'attx_add_hidden_fields_new_form', 10, 2);
function attx_add_hidden_fields_new_form($form, $is_new)
{
   if ($is_new) {
      attx_add_gf_form_fields($form);
   }
}

/**
 * Add new metabox to entry detail page, to separate plugin data from form data.
 */
add_filter('gform_entry_detail_meta_boxes', 'attx_add_entry_details_metabox', 10, 3);
function attx_add_entry_details_metabox($meta_boxes, $entry, $form)
{
   if (!isset($meta_boxes['attx'])) {
      $meta_boxes['attx'] = array(
         'title'         => esc_html__('Attribution', 'attx'),
         'callback'      => "attx_meta_box_entry_details",
         'context'       => 'side',
         'callback_args' => array($entry, $form),
      );
   }

   return $meta_boxes;
}

function attx_meta_box_entry_details($args)
{
   $attx_options = get_option("attx_options");
   $gf_attx_fields = $attx_options["config"]["gf_attx_fields"];
   $form  = $args['form'];
   $entry = $args['entry'];
   $html = '';

   foreach ($form['fields'] as $field) {

      if (isset($gf_attx_fields[$field['inputName']])) {
         $html = $html . "<p style='word-wrap: break-word;'><strong>" . $field['label'] . ":</strong> " . $entry[$field["id"]] . "</p>";
      }
   }

   echo $html;
}

/**
 * Remove plugin data from main metabox on the entry details page.
 */
add_filter('gform_entry_field_value', 'attx_remove_entry_values', 10, 4);
function attx_remove_entry_values($value, $field, $entry, $form)
{
   $attx_options = get_option("attx_options");
   $gf_attx_fields = $attx_options["config"]["gf_attx_fields"];

   if (isset($gf_attx_fields[$field['inputName']])) {
      return '';
   }

   return $value;
}
