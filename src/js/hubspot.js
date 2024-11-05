jQuery(function ($) {

    /**
     * Add the hidden field to all HubSpot forms to pass localStorage data.
     */
    $(document).on("attx.updated", function (e) {
        let attxData = JSON.parse(decodeBase64(localStorage.getItem("attx")));
        let lastStoredAttxData = attxData[attxData.length - 1];
                    
        setInterval(function () {
            let input = "";

            if (lastStoredAttxData) {
                input = $(document).find(".hs-form-iframe").contents().find("[name='attx_data']");

                if (input.length) {
                    input[0].value = JSON.stringify(lastStoredAttxData);
                }

            }

        }, 1000);
        
    });

});  