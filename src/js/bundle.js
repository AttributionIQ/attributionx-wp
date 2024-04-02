import FingerprintJS from '@fingerprintjs/fingerprintjs';
import ip from 'ip';
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
    if (attribution.ref.indexOf('google.') !== -1) {
      attribution.source = 'Google';
    } else if (attribution.ref.indexOf('instagram.') !== -1) {
      attribution.source = 'Instagram';
    }
  }

  return attribution;
}

/**
 * Add visitor ID.
 * 
 * @param {*} idName 
 * @param {*} idValue 
 * @param {*} lastStoredData 
 */
window.addVisitorId = function (idName, idValue, newData, lastStoredData) {

  if (idValue !== null) {
    if (idName !== 'fingerprint') {
      if (
        lastStoredData &&
        lastStoredData.hasOwnProperty("visitorIds") &&
        lastStoredData["visitorIds"].hasOwnProperty(idName) &&
        lastStoredData.visitorIds[idName].length
      ) {

        newData["visitorIds"][idName] = lastStoredData.visitorIds[idName];

        //Check if id's value is changed.
        if (!newData.visitorIds[idName].includes(idValue)) {
          newData["visitorIds"][idName].push(idValue);
        }

      } else {
        newData["visitorIds"][idName] = [idValue]
      }
    } else {
      if (
        lastStoredData &&
        lastStoredData.hasOwnProperty("visitorIds") &&
        lastStoredData["visitorIds"].hasOwnProperty(idName) &&
        lastStoredData.visitorIds[idName] !== ''
      ) {
        newData["visitorIds"][idName] = lastStoredData.visitorIds[idName];
      } else {
        newData["visitorIds"][idName] = idValue
      }
    }

  }

  return newData;

}


/**
 * Base64. Encode/Decode.
 */
function encodeBase64(str) {
  return btoa(encodeURIComponent(str));
}

function decodeBase64(str) {
  return decodeURIComponent(atob(str));
}
// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load({
  monitoring: false
});
jQuery(function ($) {

  $(document).on("attx.updated attx.no_params", function (attxEvent, data) {

    window.addEventListener("message", (e) => {

      //Wait for the iframe to load
      //to get access to iframe URL.
      if (
        e.origin === "https://calendly.com" &&
        e.data.event &&
        e.data.event.indexOf("calendly.") === 0 &&
        !sessionStorage.getItem("attx_calendly_updated")
      ) {

        //Check if we already updated iframe URL 
        //to prevent infinite iframe reloading.
        if (sessionStorage.getItem("attx_calendly_updated")) {
          return false;
        }



        let attribution = data.attribution;
        let visitorIds = JSON.parse(JSON.stringify(data.visitorIds));

        delete visitorIds["_ga"];
        delete visitorIds["IP"];

        let visitorIdsStr = encodeURIComponent("visitorIds: " + JSON.stringify(visitorIds));

        let newUrl = '';
        let oldUrl = jQuery("iframe[src*='calendly.com/']").attr("src");

        newUrl = oldUrl;



        if (attxEvent.namespace === "updated") {

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

          if (visitorIdsStr) {
            newUrl = updateQueryStringParameter(newUrl, "utm_content", visitorIdsStr);
          }

        } else if (attxEvent.namespace === "no_params") {

          if (attribution.hasOwnProperty("ref")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_source", attribution.ref);
          }

          if (attribution.hasOwnProperty("source")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_medium", attribution.source);
          }

          if (attribution.hasOwnProperty("path")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_campaign", attribution.path);
          }

          if (visitorIdsStr) {
            newUrl = updateQueryStringParameter(newUrl, "utm_content", visitorIdsStr);
          }

        }



        //Update iframe URL.
        jQuery("iframe[src*='calendly.com/']").attr("src", newUrl);
        sessionStorage.setItem("attx_calendly_updated", 1);

      }

    }, false);

  });

})
jQuery(function ($) {

  /**
   * Add attributions to the db.
   */
  $(document).on("attx.updated attx.no_params", function (e, data) {

    //Check if we already saved data
    //to prevent data duplication in the db
    if (sessionStorage.getItem("attx_db_updated")) {
      return false;
    }

    /**
     * Send data.
     */
    $.post(attx.ajax_url, {
      action: 'save_to_db',
      security: attx.nonce,
      host: location.hostname.replace("www.",""),
      data: data
    }, function (response) {

      let resp = JSON.parse(response);

      if (resp.success) {
        sessionStorage.setItem("attx_db_updated", 1);
      }

    });

  });

})
jQuery(function ($) {

  /**
   * Add the hidden field to all gforms to pass localStorage data to the server.
   */
  $(document).on("attx.updated", function (e) {

    $("[name=gform_submit]").after("<input type='hidden' name='attx' value='" + decodeBase64(localStorage.getItem("attx")) + "' />");

  });

})
jQuery(function ($) {

  /**
   * Add the hidden field to all quForms to pass localStorage data to the server.
   */
  $(document).on("attx.updated", function (e) {

    $("[name=quform_submit]").after("<input type='hidden' name='attx' value='" + decodeBase64(localStorage.getItem("attx")) + "' />");

  });

})
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