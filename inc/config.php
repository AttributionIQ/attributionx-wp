<?php

defined('ABSPATH') || exit;

/**
 * Hidden form fields.
 * 
 * Parameter Name => Field Label
 */
$attx_form_fields = [
  "attx_visitor_ids" => "attx_visitor_ids",
  "attx_utm_id" => "attx_utm_id",
  "attx_utm_source" => "attx_utm_source",
  "attx_utm_medium" => "attx_utm_medium",
  "attx_utm_campaign" => "attx_utm_campaign",
  "attx_utm_term" => "attx_utm_term",
  "attx_utm_content" => "attx_utm_content",
  "attx_gclid" => "attx_gclid",
  "attx_fbclid" => "attx_fbclid",
  "attx_tduid" => "attx_tduid",
  "attx_referer" => "attx_referer",
  "attx_path" => "attx_path",
  "attx_source" => "attx_source",
  "attx_time" => "attx_time",
];

$attx_options = get_option("attx_options");
$attx_options["config"]["attx_form_fields"] = $attx_form_fields;

update_option('attx_options', $attx_options, false);
