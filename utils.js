(function (globalScope) {
  function clamp(value, min, max) {
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return min;
    return Math.max(min, Math.min(max, numericValue));
  }

  function randomIntInRange(min, max) {
    const low = Math.ceil(Math.min(min, max));
    const high = Math.floor(Math.max(min, max));
    return Math.floor(Math.random() * (high - low + 1)) + low;
  }

  const utils = { clamp, randomIntInRange };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
  }
  if (globalScope) {
    globalScope.VenueIQUtils = utils;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
