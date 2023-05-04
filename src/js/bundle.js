/**
 * Update URL parameters.
 * 
 * @param {*} uri 
 * @param {*} key 
 * @param {*} value 
 * @returns 
 */
window.updateQueryStringParameter = function (uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}

/**
 * Add default params such as time, path, ref, and source.
 * @param {*} data 
 * @returns 
 */
window.addDefaultParams = function (attribution) {
  const searchParams = new URLSearchParams(window.location.search);

  attribution.time = (new Date()).toUTCString();
  attribution.path = location.pathname;
  attribution.ref = encodeURIComponent(document.referrer) || 'direct';

  if (searchParams.has('gclid')) {
    attribution.source = 'Google Ads';
  } else if (searchParams.has('fbclid')) {
    attribution.source = 'Meta Ads';
  } else if (searchParams.has('tduid')) {
    attribution.source = 'Tradedoubler';
  } else {
    if (attribution.ref.indexOf('google') !== -1) {
      attribution.source = 'Google';
    } else if (attribution.ref.indexOf('instagram') !== -1) {
      attribution.source = 'Instagram';
    }
  }

  return attribution;
}
import FingerprintJS from '@fingerprintjs/fingerprintjs'

// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load({
  monitoring: false
});
jQuery(function ($) {
  let calendlyUrlUpdated = 0;

  /**
   * Wait until storage will be updated.
   */
  $(document).on("attx.updated", function () {

    window.addEventListener("message", (e) => {

      //Wait for the iframe to load
      //to get access to iframe URL.
      if (
        e.origin === "https://calendly.com" &&
        e.data.event &&
        e.data.event.indexOf("calendly.") === 0
      ) {

        let storage = localStorage.getItem("attx");
        if (storage) {
          storage = JSON.parse(storage);
          let lastStoredData = storage[storage.length - 1];
          let attribution = lastStoredData.attribution;
          let visitorIds = encodeURIComponent("visitorIds: " + JSON.stringify(lastStoredData.visitorIds));

          //Check if we already updated iframe URL 
          //to prevent infinite iframe reloading.
          if (calendlyUrlUpdated) {
            return false;
          }

          let newUrl = '';
          let oldUrl = jQuery("iframe[src*='calendly.com/']").attr("src");

          newUrl = oldUrl;

          if (attribution.hasOwnProperty("utm_source")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_source", attribution.utm_source);
          }

          if (attribution.hasOwnProperty("utm_medium")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_medium", attribution.utm_medium);
          }

          if (attribution.hasOwnProperty("utm_campaign")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_campaign", attribution.utm_campaign);
          }

          if (attribution.hasOwnProperty("utm_term")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_term", attribution.utm_term);
          }

          if (visitorIds) {
            newUrl = updateQueryStringParameter(newUrl, "utm_content", visitorIds);
          }

          //Update iframe URL.
          jQuery("iframe[src*='calendly.com/']").attr("src", newUrl);
          calendlyUrlUpdated = 1;

        }

      }

    }, false);

  });


  /**
   * Save default attribution if we don't have params in the URL.
   */
  $(document).on("attx.no_params", function () {

    window.addEventListener("message", (e) => {

      //Wait for the iframe to load
      //to get access to iframe URL.
      if (
        e.origin === "https://calendly.com" &&
        e.data.event &&
        e.data.event.indexOf("calendly.") === 0
      ) {

        ; (async () => {

          const fp = await fpPromise;
          const fpAgent = await fp.get();

          let visitorId = '';

          if (fpAgent.visitorId !== null) {
            visitorId = encodeURIComponent("visitorId: " + fpAgent.visitorId)
          }

          let attribution = {};
          attribution = addDefaultParams(attribution);

          //Check if we already updated iframe URL 
          //to prevent infinite iframe reloading.
          if (calendlyUrlUpdated) {
            return false;
          }

          let newUrl = '';
          let oldUrl = jQuery("iframe[src*='calendly.com/']").attr("src");

          newUrl = oldUrl;

          if (attribution.hasOwnProperty("ref")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_source", attribution.ref);
          }

          if (attribution.hasOwnProperty("source")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_medium", attribution.source);
          }

          if (attribution.hasOwnProperty("path")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_campaign", attribution.path);
          }

          if (visitorId) {
            newUrl = updateQueryStringParameter(newUrl, "utm_content", visitorId);
          }

          //Update iframe URL.
          jQuery("iframe[src*='calendly.com/']").attr("src", newUrl);
          calendlyUrlUpdated = 1;

        })();

      }

    }, false);

  });

})
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
jQuery(function ($) {

  /**
   * Add the hidden field to all gforms to pass localStorage data to the server.
   */
  $(document).on("attx.updated", function (e) {

    $("[name=gform_submit]").after("<input type='hidden' name='attx' value='" + localStorage.getItem("attx") + "' />");

  });

})
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