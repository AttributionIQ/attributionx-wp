jQuery(function ($) {

  /**
   * Add attributions to the db.
   */
  $(document).on("attx.updated attx.no_params", function (e) {

    //Check if we already saved data
    //to prevent data duplication in the db
    if (sessionStorage.getItem("attx_db_updated")) {
      return false;
    }

    let data = {
      visitorIds: {},
      attribution: {}
    };

    if (e.namespace === "updated") {
      let storage = localStorage.getItem("attx");

      if (storage) {
        storage = JSON.parse(storage);

        data = storage[storage.length - 1];
      } else {
        return false;
      }

      save(data);

    } else if (e.namespace === "no_params") {

      ; (async () => {

        const fp = await fpPromise;
        const fpAgent = await fp.get();

        if (fpAgent.visitorId !== null) {
          data.visitorIds = {
            fingerprint: [fpAgent.visitorId]
          }
        }

        data.attribution = addDefaultParams(data.attribution);

        save(data);

      })();

    }

  });

  /**
   * Send data.
   * 
   * @param {*} data 
   */
  function save(data) {

    $.post(attx.ajax_url, {
      action: 'save_to_db',
      security: attx.nonce,
      host: location.hostname,
      data: data
    }, function (response) {

      let resp = JSON.parse(response);

      if (resp.success) {
        sessionStorage.setItem("attx_db_updated", 1);
      }

    });

  }

})