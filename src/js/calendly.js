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