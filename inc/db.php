<?php

defined('ABSPATH') || exit;

/**
 * Save data to the db.
 */
add_action('wp_ajax_save_to_db', 'attx_save_to_db');
add_action('wp_ajax_nopriv_save_to_db', 'attx_save_to_db');
function attx_save_to_db()
{
  // Verify the nonce
  if (!wp_verify_nonce($_POST['security'], '(*u3refsiId)')) {

    echo '{"success":false, "error": {"message": "Security check failed"}}';

    wp_die();
  }

  //Get API Key
  $attx_options = get_option('attx_options');
  $api_key = isset($attx_options["attx_field_api_key"]) ? $attx_options["attx_field_api_key"] : "";

  //Send request
  $url = 'https://myxznsjxiabywzqxedih.functions.supabase.co/events';

  $incoming_data = $_POST['data'];

  $data = array(
    "visitorIds" => $incoming_data["visitorIds"],
    "attributionData" => $incoming_data["attribution"],
    "host" => $_POST['host'],
    "api_key" => $api_key
  );

  $options = array(
    'http' => array(
      'header'  => "Content-type: application/json",
      'method'  => 'POST',
      'content' => json_encode($data),
      'follow_location' => true,
    ),
  );

  $context  = stream_context_create($options);

  $result = @file_get_contents($url, false, $context);

  if ($result === false) {
    echo '{"success":false}';
  } else {
    echo $result;
  }

  wp_die();
}
