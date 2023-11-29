jQuery(function ($) {

  /**
   * Add attributions to the db.
   */
  $(document).on("attx.updated attx.no_params", function (e, data) {

    //Check if we already saved data
    //to prevent data duplication in the db
    if (sessionStorage.getItem("attx_db_updated")) {
      return false;
    }

    /**
     * Send data.
     */
    $.post(attx.ajax_url, {
      action: 'save_to_db',
      security: attx.nonce,
      host: location.hostname.replace("www.",""),
      data: data
    }, function (response) {

      let resp = JSON.parse(response);

      if (resp.success) {
        sessionStorage.setItem("attx_db_updated", 1);
      }

    });

  });

})