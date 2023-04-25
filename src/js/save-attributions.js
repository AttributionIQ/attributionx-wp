jQuery(function ($) {

  /**
   * To prevent duplication of data in a session.
   */
  if (sessionStorage.getItem("attx_updated")) {
    $(document).trigger("attx.updated");
    return;
  }

  let data = {};

  const params = ['utm_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'tduid'];

  const searchParams = new URLSearchParams(window.location.search);
  params.forEach(param => {
    if (searchParams.has(param)) {
      data[param] = searchParams.get(param);
    }
  });

  /**
   * Exit if we don't have params in the URL.
   */
  if (!Object.keys(data).length) {
    $(document).trigger("attx.no_params");
    return;
  }

  /**
   * Add default params such as time, path, ref, and source.
   */
  data = addDefaultParams(data);

  /**
   * Save data to the localStorage.
   */
  let storage = localStorage.getItem("attx");

  if (storage) {
    storage = JSON.parse(storage);
  } else {
    storage = [];
  }

  storage.push(data);

  localStorage.setItem("attx", JSON.stringify(storage));

  sessionStorage.setItem("attx_updated", 1);
  
  $(document).trigger("attx.updated");

})