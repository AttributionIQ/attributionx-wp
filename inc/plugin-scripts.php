<?php

/**
 * Client side.
 */
add_action('wp_enqueue_scripts', 'attx_plugin_scripts');
function attx_plugin_scripts()
{
  wp_enqueue_script('attx-save-attributions', plugin_dir_url(__FILE__) . '../assets/js/scripts.min.js', array('jquery'), false, true);

  wp_localize_script('attx-save-attributions', 'attx', array(
    'ajax_url' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('(*u3refsiId)')
  ));
}
