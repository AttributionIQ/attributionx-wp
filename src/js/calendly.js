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
          let attributions = storage[storage.length - 1];

          //Check if we already updated iframe URL 
          //to prevent infinite iframe reloading.
          if (calendlyUrlUpdated) {
            return false;
          }

          let newUrl = '';
          let oldUrl = jQuery("iframe[src*='calendly.com/']").attr("src");

          newUrl = oldUrl;

          if (attributions.hasOwnProperty("utm_source")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_source", attributions.utm_source);
          }

          if (attributions.hasOwnProperty("utm_medium")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_medium", attributions.utm_medium);
          }

          if (attributions.hasOwnProperty("utm_campaign")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_campaign", attributions.utm_campaign);
          }

          if (attributions.hasOwnProperty("utm_content")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_content", attributions.utm_content);
          }

          if (attributions.hasOwnProperty("utm_term")) {
            newUrl = updateQueryStringParameter(newUrl, "utm_term", attributions.utm_term);
          }

          //Update iframe URL.
          jQuery("iframe[src*='calendly.com/']").attr("src", newUrl);
          calendlyUrlUpdated = 1;

        }

      }

    }, false);

  });


  /**
   * Save default attributions if we don't have params in the URL.
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

        let attributions = {};

        attributions = addDefaultParams(attributions);

        //Check if we already updated iframe URL 
        //to prevent infinite iframe reloading.
        if (calendlyUrlUpdated) {
          return false;
        }

        let newUrl = '';
        let oldUrl = jQuery("iframe[src*='calendly.com/']").attr("src");

        newUrl = oldUrl;

        if (attributions.hasOwnProperty("ref")) {
          newUrl = updateQueryStringParameter(newUrl, "utm_source", attributions.ref);
        }

        if (attributions.hasOwnProperty("source")) {
          newUrl = updateQueryStringParameter(newUrl, "utm_medium", attributions.source);
        }

        if (attributions.hasOwnProperty("path")) {
          newUrl = updateQueryStringParameter(newUrl, "utm_campaign", attributions.path);
        }

        //Update iframe URL.
        jQuery("iframe[src*='calendly.com/']").attr("src", newUrl);
        calendlyUrlUpdated = 1;
      }

    }, false);

  });

})