jQuery(function ($) {

  /**
   * Add the hidden field to all quForms to pass localStorage data to the server.
   */
  $(document).on("attx.updated", function (e) {

    $("[name=quform_submit]").after("<input type='hidden' name='attx' value='" + decodeBase64(localStorage.getItem("attx")) + "' />");

  });

})