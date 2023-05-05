jQuery(function ($) {
  let data = {
    visitorIds: {},
    attribution: {}
  };

  /**
   * Get data from localStorage.
   */
  let storage = localStorage.getItem("attx");

  if (storage) {
    storage = JSON.parse(decodeBase64(storage));
  } else {
    storage = [];
  }

  /**
   * Get last stored data in localStorage.
   */
  let lastStoredData = false;

  if (storage.length) {
    lastStoredData = JSON.parse(JSON.stringify(storage[storage.length - 1]));
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
    const searchParams = new URLSearchParams(window.location.search);
    let urlHasParams = false;

    searchParams.forEach((value, key) => {
      urlHasParams = true;
      data.attribution[key] = value;
    });

    /**
     * Add default params such as time, path, ref, and source.
     */
    data.attribution = addDefaultParams(data.attribution);

    /**
     * Add fingerprint ID.
     */
    const fp = await fpPromise
    const fpAgent = await fp.get()

    data = addVisitorId('fingerprint', fpAgent.visitorId, data, lastStoredData);

    /**
     * Add _ga ID.
     */
    var _ga = document.cookie.split(';').filter(function (cookie) {
      return cookie.trim().startsWith('_ga=')
    })[0];

    if (_ga) {
      data = addVisitorId('_ga', _ga.replace("_ga=", "").trim(), data, lastStoredData);
    }

    /**
     * Add user IP.
     */
    data["visitorIds"]["IP"] = ip.address()

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

    localStorage.setItem("attx", encodeBase64(JSON.stringify(storage)));

    sessionStorage.setItem("attx_updated", 1);

    $(document).trigger("attx.updated", data);

  })();

})