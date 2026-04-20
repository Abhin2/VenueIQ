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

  // Extracts hidden action tags from LLM output and returns clean text + actions list
  // Supported tags: [ACTION: DISPATCH] [ACTION: LOCKDOWN] [ACTION: REPORT]
  function parseAgentActions(inputText) {
    const text = String(inputText || '');
    const actions = [];

    const tags = [
      { tag: '[ACTION: DISPATCH]', action: 'DISPATCH' },
      { tag: '[ACTION: LOCKDOWN]', action: 'LOCKDOWN' },
      { tag: '[ACTION: REPORT]', action: 'REPORT' }
    ];

    let clean = text;
    for (const t of tags) {
      if (clean.includes(t.tag)) {
        actions.push(t.action);
        clean = clean.split(t.tag).join('');
      }
    }

    return { cleanText: clean.trim(), actions };
  }

  const utils = { clamp, randomIntInRange, parseAgentActions };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
  }
  if (globalScope) {
    globalScope.VenueIQUtils = utils;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
