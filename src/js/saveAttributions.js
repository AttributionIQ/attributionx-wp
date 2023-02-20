jQuery(function ($) {

  const data = {
    time: (new Date()).toUTCString(),
    path: location.pathname,
    ref: encodeURIComponent(document.referrer) || 'direct',
    source: ''
  };

  const params = ['utm_id', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', , 'utm_content', 'gclid', 'fbclid', 'tduid'];

  const searchParams = new URLSearchParams(window.location.search);
  params.forEach(param => {
    if (searchParams.has(param)) {
      data[param] = searchParams.get(param);
    }
  });

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

  if (!sessionStorage.getItem("attxTmp")) {
    sessionStorage.setItem("attxTmp", JSON.stringify(data));
  }

  /**
   * Pass data to the server.
   */
  $(document).on('submit.gravityforms', '.gform_wrapper form', function (event) {

    if (!$(this).find("input[name=attx]").length) {
      let storage = localStorage.getItem("attx");

      if (storage) {
        storage = JSON.parse(localStorage.getItem("attx"));
      } else {
        storage = [];
      }

      let tempStorage = sessionStorage.getItem("attxTmp");
      if (tempStorage) {
        storage.push(JSON.parse(tempStorage));
      }

      //Save data to localStorage.
      localStorage.setItem("attx", JSON.stringify(storage))

      //Add hidden field to all gforms to pass localStorage data to the server.
      $(this).append("<input type='hidden' name='attx' value='" + JSON.stringify(storage) + "' />");
    }

  });

})