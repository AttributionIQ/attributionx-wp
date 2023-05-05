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