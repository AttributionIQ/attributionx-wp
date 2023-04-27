<?php

/**
 * Save data to the db.
 */
add_action('wp_ajax_save_to_db', 'attx_save_to_db');
add_action('wp_ajax_nopriv_save_to_db', 'attx_save_to_db');
function attx_save_to_db()
{
  // Verify the nonce
  if (!wp_verify_nonce($_POST['security'], '(*u3refsiId)')) {
    wp_die('Security check failed');
  }

  //Get API Key
  $attx_options = get_option('attx_options');
  $api_key = isset($attx_options["attx_field_api_key"]) ? $attx_options["attx_field_api_key"] : "";

  //Send request
  $url = 'https://myxznsjxiabywzqxedih.functions.supabase.co/events';

  $data = array(
    "attributionData" => $_POST['attributions'],
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