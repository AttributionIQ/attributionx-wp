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