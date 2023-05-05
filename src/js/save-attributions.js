jQuery(function ($) {

  /**
   * To prevent duplication of data in a session.
   */
  if (sessionStorage.getItem("attx_updated")) {
    $(document).trigger("attx.updated");
    return;
  }

  let data = {
    visitorIds: {},
    attribution: {}
  };

  const params = ['utm_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'tduid'];

  const searchParams = new URLSearchParams(window.location.search);
  params.forEach(param => {
    if (searchParams.has(param)) {
      data.attribution[param] = searchParams.get(param);
    }
  });

  /**
   * Exit if we don't have params in the URL.
   */
  if (!Object.keys(data.attribution).length) {
    $(document).trigger("attx.no_params");
    return;
  }

  /**
   * Add default params such as time, path, ref, and source.
   */
  data.attribution = addDefaultParams(data.attribution);

  /**
   * Get localStorage.
   */
  let storage = localStorage.getItem("attx");

  if (storage) {
    storage = JSON.parse(storage);
  } else {
    storage = [];
  }

  ; (async () => {

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
     * Save data to the localStorage.
     */
    storage.push(data);

    localStorage.setItem("attx", JSON.stringify(storage));

    sessionStorage.setItem("attx_updated", 1);

    $(document).trigger("attx.updated");

  })();

})