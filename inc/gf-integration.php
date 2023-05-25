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

      $attx_options = json_decode(get_option("attx_options"), true);
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
