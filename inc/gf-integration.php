<?php

add_action('gform_pre_submission', 'attx_gform_pre_submission_handler');
function attx_gform_pre_submission_handler($form)
{

   //Get data.
   if (isset($_POST["attx"])) {
      $storage = json_decode(stripslashes($_POST["attx"]));
      $storage = (array) end($storage);
   } else {
      $storage = [];
   }

   //Populate fields.
   if (isset($form["fields"]) && is_array($form["fields"])) {
      foreach ($form["fields"] as $field) {
         if ($field["inputName"] === "utm_id") {

            $_POST['input_' . $field["id"]] =  isset($storage["utm_id"]) ? $storage["utm_id"] : "";
         } else if ($field["inputName"] === "utm_source") {

            $_POST['input_' . $field["id"]] =  isset($storage["utm_source"]) ? $storage["utm_source"] : "";
         } else if ($field["inputName"] === "utm_medium") {

            $_POST['input_' . $field["id"]] =  isset($storage["utm_medium"]) ? $storage["utm_medium"] : "";
         } else if ($field["inputName"] === "utm_campaign") {

            $_POST['input_' . $field["id"]] =  isset($storage["utm_campaign"]) ? $storage["utm_campaign"] : "";
         } else if ($field["inputName"] === "utm_term") {

            $_POST['input_' . $field["id"]] =  isset($storage["utm_term"]) ? $storage["utm_term"] : "";
         } else if ($field["inputName"] === "utm_content") {

            $_POST['input_' . $field["id"]] =  isset($storage["utm_content"]) ? $storage["utm_content"] : "";
         } else if ($field["inputName"] === "gclid") {

            $_POST['input_' . $field["id"]] =  isset($storage["gclid"]) ? $storage["gclid"] : "";
         } else if ($field["inputName"] === "fbclid") {

            $_POST['input_' . $field["id"]] =  isset($storage["fbclid"]) ? $storage["fbclid"] : "";
         } else if ($field["inputName"] === "tduid") {

            $_POST['input_' . $field["id"]] =  isset($storage["tduid"]) ? $storage["tduid"] : "";
         } else if ($field["inputName"] === "referer") {

            $_POST['input_' . $field["id"]] =  isset($storage["ref"]) ? urldecode($storage["ref"]) : "";
         } else if ($field["inputName"] === "path") {

            $_POST['input_' . $field["id"]] =  isset($storage["path"]) ? $storage["path"] : "";
         } else if ($field["inputName"] === "source") {

            $_POST['input_' . $field["id"]] =  isset($storage["source"]) ? $storage["source"] : "";
         } else if ($field["inputName"] === "time") {

            $_POST['input_' . $field["id"]] =  isset($storage["time"]) ? $storage["time"] : "";
         }
      }
   }
}
