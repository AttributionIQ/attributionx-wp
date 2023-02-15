<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  Attribution X

  <?php
  $attx = [];

  //Get UTM attributions
  if (isset($_GET["utm_id"]) && $_GET["utm_id"] !== '') {
    $attx["utm_id"] = $_GET["utm_id"];
  }

  if (isset($_GET["utm_source"]) && $_GET["utm_source"] !== '') {
    $attx["utm_source"] = $_GET["utm_source"];
  }

  if (isset($_GET["utm_medium"]) && $_GET["utm_medium"] !== '') {
    $attx["utm_medium"] = $_GET["utm_medium"];
  }

  if (isset($_GET["utm_campaign"]) && $_GET["utm_campaign"] !== '') {
    $attx["utm_campaign"] = $_GET["utm_campaign"];
  }

  if (isset($_GET["utm_term"]) && $_GET["utm_term"] !== '') {
    $attx["utm_term"] = $_GET["utm_term"];
  }

  if (isset($_GET["utm_content"]) && $_GET["utm_content"] !== '') {
    $attx["utm_content"] = $_GET["utm_content"];
  }

  if (isset($_GET["gclid"]) && $_GET["gclid"] !== '') {
    $attx["gclid"] = $_GET["gclid"];
  }

  if (isset($_GET["fbclid"]) && $_GET["fbclid"] !== '') {
    $attx["fbclid"] = $_GET["fbclid"];
  }

  if (isset($_GET["tduid"]) && $_GET["tduid"] !== '') {
    $attx["tduid"] = $_GET["tduid"];
  }

  //Get referer
  if (isset($_SERVER['HTTP_REFERER'])) {
    $attx["referer"] = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_HOST);
  }

  //Get path
  if (isset($_SERVER["REQUEST_URI"])) {
    $attx["path"] = strtok($_SERVER["REQUEST_URI"], '?');
  }

  //Set source
  if (isset($attx["gclid"])) {
    $attx["source"] = "Google Ads";
  } else if (isset($attx["fbclid"])) {
    $attx["source"] = "Meta Ads";
  } else if (isset($attx["fbclid"])) {
    $attx["source"] = "Trade Doubler";
  } else if (isset($attx["referer"]) && strpos($attx["referer"], "google") !== false) {
    $attx["source"] = "Google";
  } else if (isset($attx["referer"]) && strpos($attx["referer"], "instagram") !== false) {
    $attx["source"] = "Instagram";
  }

  //Set time
  $attx["time"] = date("D, d M Y H:i:s T");

  //Set cookie
  foreach ($attx as $k => $v) {
    setcookie("attx[" . $k . "]", $v, time() + 60 * 60 * 24 * 365);
  }
  ?>

</body>

</html>