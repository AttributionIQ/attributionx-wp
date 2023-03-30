jQuery(function ($) {

  /**
   * Add the hidden field to all gforms to pass localStorage data to the server.
   */
  $(document).on("attx.updated attx.no_params", function (e) {

    $("[name=gform_submit]").after("<input type='hidden' name='attx' value='" + localStorage.getItem("attx") + "' />");

  })

});