<?php

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
      foreach ($form["fields"] as $field) {
         if ($field["inputName"] === "attx_visitor_ids") {

            $_POST['input_' . $field["id"]] =  isset($storage["visitorIds"]) ? json_encode($storage["visitorIds"]) : "";
         } else if ($field["inputName"] === "attx_utm_id") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["utm_id"]) ? $storage["attribution"]["utm_id"] : "";
         } else if ($field["inputName"] === "attx_utm_source") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["utm_source"]) ? $storage["attribution"]["utm_source"] : "";
         } else if ($field["inputName"] === "attx_utm_medium") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["utm_medium"]) ? $storage["attribution"]["utm_medium"] : "";
         } else if ($field["inputName"] === "attx_utm_campaign") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["utm_campaign"]) ? $storage["attribution"]["utm_campaign"] : "";
         } else if ($field["inputName"] === "attx_utm_term") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["utm_term"]) ? $storage["attribution"]["utm_term"] : "";
         } else if ($field["inputName"] === "attx_utm_content") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["utm_content"]) ? $storage["attribution"]["utm_content"] : "";
         } else if ($field["inputName"] === "attx_gclid") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["gclid"]) ? $storage["attribution"]["gclid"] : "";
         } else if ($field["inputName"] === "attx_fbclid") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["fbclid"]) ? $storage["attribution"]["fbclid"] : "";
         } else if ($field["inputName"] === "attx_tduid") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["tduid"]) ? $storage["attribution"]["tduid"] : "";
         } else if ($field["inputName"] === "attx_referer") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["ref"]) ? urldecode($storage["attribution"]["ref"]) : "";
         } else if ($field["inputName"] === "attx_path") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["path"]) ? $storage["attribution"]["path"] : "";
         } else if ($field["inputName"] === "attx_source") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["source"]) ? $storage["attribution"]["source"] : "";
         } else if ($field["inputName"] === "attx_time") {

            $_POST['input_' . $field["id"]] =  isset($storage["attribution"]["time"]) ? $storage["attribution"]["time"] : "";
         }
      }
   }
}
