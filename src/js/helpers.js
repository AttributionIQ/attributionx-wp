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
window.addDefaultParams = function (data) {
  const searchParams = new URLSearchParams(window.location.search);

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

  return data;
}