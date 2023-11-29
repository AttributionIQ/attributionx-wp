<?php

/**
 * Integration with the QuForm plugin.
 */

defined('ABSPATH') || exit;

/**
 * Run only if the QuForm plugin installed and activated.
 */
if (!is_quform_active()) {
  return;
}

/**
 * Save attributions to a QuForm.
 */
add_filter('quform_pre_process', 'attx_quform_pre_process_handler', 10, 2);
function attx_quform_pre_process_handler($result, $form)
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
  $attx_options = get_option("attx_options");
  $attx_form_fields = $attx_options["config"]["attx_form_fields"];
  foreach ($form->getPages() as $page) {
    foreach ($page->getElements() as $k => $field) {
      $field_dynamic_key = $field->config()["dynamicKey"];

      if (
        isset($attx_form_fields[$field_dynamic_key]) &&
        $field_dynamic_key !== "attx_visitor_ids" &&
        $field_dynamic_key !== "attx_referer"
      ) {
        $slug = str_replace("attx_", "", $field_dynamic_key);
        $_POST[$k] =  isset($storage["attribution"][$slug]) ? $storage["attribution"][$slug] : "";
      } else if (isset($attx_form_fields[$field_dynamic_key]) && $field_dynamic_key === "attx_visitor_ids") {
        $_POST[$k] =  isset($storage["visitorIds"]) ? json_encode($storage["visitorIds"]) : "";
      } else if (isset($attx_form_fields[$field_dynamic_key]) && $field_dynamic_key === "attx_referer") {
        $_POST[$k] =  isset($storage["attribution"]["ref"]) ? urldecode($storage["attribution"]["ref"]) : "";
      }
    }
  }

  return $result;
}

/**
 * Add attx hidden fields to a new QuForm.
 */
add_action('quform_add_form', "attx_add_hidden_fields_to_new_quform", 10, 1);
function attx_add_hidden_fields_to_new_quform($form)
{
  attx_add_hidden_fields_to_quform($form);
}
