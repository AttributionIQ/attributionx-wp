jQuery(function ($) {
  let data = {
    visitorIds: {},
    attribution: {}
  };

  /**
   * Get localStorage.
   */
  let storage = localStorage.getItem("attx");

  if (storage) {
    storage = JSON.parse(storage);
  } else {
    storage = [];
  }

  /**
   * To prevent duplication of data in a session.
   */
  if (sessionStorage.getItem("attx_updated")) {

    if (storage.length) {
      data = storage[storage.length - 1];
    }

    $(document).trigger("attx.updated", data);

    return;
  }

  ; (async () => {

    /**
     * Add params from URL.
     */
    const params = ['utm_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'tduid'];
    const searchParams = new URLSearchParams(window.location.search);
    let urlHasParams = false;

    params.forEach(param => {
      if (searchParams.has(param)) {
        urlHasParams = true;

        data.attribution[param] = searchParams.get(param);
      }
    });

    /**
     * Add default params such as time, path, ref, and source.
     */
    data.attribution = addDefaultParams(data.attribution);

    /**
     * Add visitor ID's.
     */
    const fp = await fpPromise
    const fpAgent = await fp.get()

    let lastStoredData = false;

    if (storage.length) {
      lastStoredData = JSON.parse(JSON.stringify(storage[storage.length - 1]));
    }

    if (
      lastStoredData &&
      lastStoredData.hasOwnProperty("visitorIds") &&
      lastStoredData["visitorIds"].hasOwnProperty("fingerprint") &&
      lastStoredData.visitorIds.fingerprint.length
    ) {

      data["visitorIds"]["fingerprint"] = lastStoredData.visitorIds.fingerprint;

      //Check if fingerprint is changed.
      if (
        !lastStoredData.visitorIds.fingerprint.includes(fpAgent.visitorId) &&
        fpAgent.visitorId !== null
      ) {
        data["visitorIds"]["fingerprint"].push(fpAgent.visitorId);
      }

    } else {
      data["visitorIds"]["fingerprint"] = [fpAgent.visitorId]
    }

    /**
     * Add _ga.
     */
    var _ga = document.cookie.split(';').filter(function (cookie) {
      return cookie.trim().startsWith('_ga=')
    })[0];

    if (_ga) {
      data["visitorIds"]["_ga"] = _ga.replace("_ga=", "").trim();
    }

    /**
     * Exit if we don't have params in the URL.
     */
    if (!urlHasParams) {
      $(document).trigger("attx.no_params", data);
      return;
    }

    /**
     * Save data to the localStorage.
     */
    storage.push(data);

    localStorage.setItem("attx", JSON.stringify(storage));

    sessionStorage.setItem("attx_updated", 1);

    $(document).trigger("attx.updated", data);

  })();

})