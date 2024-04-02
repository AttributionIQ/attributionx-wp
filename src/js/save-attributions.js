jQuery(function ($) {

  /**
   * Ignore the scenario where a new tab is opened from the same site
   */
  let currentHostname = location.hostname.replace("www.","");
  let currentHostnameRegex = new RegExp(currentHostname);

  if (currentHostnameRegex.test(document.referrer)) {
    return false;
  }

  /**
   * Init.
   */
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

    searchParams.forEach((value, key) => {
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
     * Save data to the localStorage.
     */
    storage.push(data);

    localStorage.setItem("attx", encodeBase64(JSON.stringify(storage)));

    sessionStorage.setItem("attx_updated", 1);

    $(document).trigger("attx.updated", data);

  })();

})