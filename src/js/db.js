jQuery(function ($) {

  /**
   * Save attributions to the db.
   */
  $(document).on("attx.updated attx.no_params", function (e) {

    //Check if we already saved data
    //to prevent data duplication in the db
    if (sessionStorage.getItem("attx_db_updated")) {
      return false;
    }


    let attributions = {};

    if (e.namespace === "updated") {
      let storage = localStorage.getItem("attx");

      if (storage) {
        storage = JSON.parse(storage);

        attributions = storage[storage.length - 1];
      } else {
        return false;
      }
    } else if (e.namespace === "no_params") {
      attributions = addDefaultParams(attributions);
    }

    //Save
    $.post(attx.ajax_url, {
      action: 'save_to_db',
      security: attx.nonce,
      host: location.hostname,
      attributions: attributions
    }, function (response) {

      let resp = JSON.parse(response);

      if (resp.success) {
        sessionStorage.setItem("attx_db_updated", 1);
      }

    });

  });

})