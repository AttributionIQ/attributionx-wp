<?php

defined('ABSPATH') || exit;

/**
 * custom option and settings
 */
function attx_settings_init()
{

  // Register a new setting for "attx" page.
  register_setting('attx', 'attx_options');

  // Register a new section in the "wporg" page.
  add_settings_section(
    'attx_section_general',
    '',
    'attx_section_general_callback',
    'attx'
  );

  // Register a new field in the "attx_general_section" section, inside the "attx" page.
  add_settings_field(
    'attx_field_api_key', // As of WP 4.6 this value is used only internally.
    // Use $args' label_for to populate the id inside the callback.
    __('API Key:', 'attx'),
    'attx_field_api_key_cb',
    'attx',
    'attx_section_general',
    array(
      'label_for'         => 'attx_field_api_key',
      'class'             => 'attx_row',
      'attx_custom_data' => 'custom',
    )
  );
}


/**
 * Register our attx_settings_init to the admin_init action hook.
 */
add_action('admin_init', 'attx_settings_init');


/**
 * General section callback function.
 *
 * @param array $args  The settings array, defining title, id, callback.
 */
function attx_section_general_callback($args)
{
}


/**
 * API key field callback function.
 *
 * WordPress has magic interaction with the following keys: label_for, class.
 * - the "label_for" key value is used for the "for" attribute of the <label>.
 * - the "class" key value is used for the "class" attribute of the <tr> containing the field.
 * Note: you can add custom key value pairs to be used inside your callbacks.
 *
 * @param array $args
 */
function attx_field_api_key_cb($args)
{
  // Get the value of the setting we've registered with register_setting()
  $options = get_option('attx_options');
?>

  <input id="<?php echo esc_attr($args['label_for']); ?>" type="text" name="attx_options[<?php echo esc_attr($args['label_for']); ?>]" value="<?php echo isset($options[$args['label_for']]) ? $options[$args['label_for']] : ''; ?>">

<?php
}


/**
 * Add the top level menu page.
 */
function attx_options_page()
{
  add_options_page(
    'AttributionX',
    'AttributionX',
    'manage_options',
    'attx',
    'attx_options_page_html'
  );
}


/**
 * Register our attx_options_page to the admin_menu action hook.
 */
add_action('admin_menu', 'attx_options_page');


/**
 * Top level menu callback function
 */
function attx_options_page_html()
{
  // check user capabilities
  if (!current_user_can('manage_options')) {
    return;
  }

  // add error/update messages

  // check if the user have submitted the settings
  // WordPress will add the "settings-updated" $_GET parameter to the url
  if (isset($_GET['settings-updated'])) {
    // add settings saved message with the class of "updated"
    add_settings_error('attx_messages', 'attx_message', __('Settings Saved', 'attx'), 'updated');
  }

  // show error/update messages
  settings_errors('attx_messages');
?>
  <div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    <form action="options.php" method="post">
      <?php
      // output security fields for the registered setting "attx"
      settings_fields('attx');
      // output setting sections and their fields
      // (sections are registered for "attx", each field is registered to a specific section)
      do_settings_sections('attx');
      // output save settings button
      submit_button('Save Settings');
      ?>
    </form>
  </div>
<?php
}
