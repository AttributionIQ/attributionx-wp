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


  data.time = (new Date()).toUTCString();
  data.path = location.pathname;
  data.ref = encodeURIComponent(document.referrer) || 'direct';

  if (searchParams.has('gclid')) {
    data.source = 'Google Ads';
  } else if (searchParams.has('fbclid')) {
    data.source = 'Meta Ads';
  } else if (searchParams.has('tduid')) {
    data.source = 'Tradedoubler';
  } else {
    if (data.ref.indexOf('google') !== -1) {
      data.source = 'Google';
    } else if (data.ref.indexOf('instagram') !== -1) {
      data.source = 'Instagram';
    }
  }

  let storage = localStorage.getItem("attx");

  if (storage) {
    storage = JSON.parse(storage);
  } else {
    storage = [];
  }

  storage.push(data);

  //Save data to the localStorage.
  localStorage.setItem("attx", JSON.stringify(storage));
  sessionStorage.setItem("attx_updated", 1);
  $(document).trigger("attx.updated");

})