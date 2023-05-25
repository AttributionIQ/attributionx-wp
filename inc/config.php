<?php

defined('ABSPATH') || exit;

/**
 * Gravity Forms hidden fields.
 * 
 * Parameter Name => Field Label
 */
$gf_attx_fields = [
  "attx_visitor_ids" => "visitor_ids",
  "attx_utm_id" => "utm_id",
  "attx_utm_source" => "utm_source",
  "attx_utm_medium" => "utm_medium",
  "attx_utm_campaign" => "utm_campaign",
  "attx_utm_term" => "utm_term",
  "attx_utm_content" => "utm_content",
  "attx_gclid" => "gclid",
  "attx_fbclid" => "fbclid",
  "attx_tduid" => "tduid",
  "attx_referer" => "referer",
  "attx_path" => "path",
  "attx_source" => "source",
  "attx_time" => "time",
];

$attx_options = json_decode(get_option("attx_options"), true);
$attx_options["config"]["gf_attx_fields"] = $gf_attx_fields;

update_option('attx_options', json_encode($attx_options), false);
