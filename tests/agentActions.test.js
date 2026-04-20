const { parseAgentActions } = require('../utils');

describe('parseAgentActions', () => {
  test('extracts DISPATCH and cleans text', () => {
    const r = parseAgentActions('[ACTION: DISPATCH] hello');
    expect(r.actions).toEqual(['DISPATCH']);
    expect(r.cleanText).toBe('hello');
  });

  test('extracts multiple actions', () => {
    const r = parseAgentActions('x [ACTION: REPORT] y [ACTION: LOCKDOWN]');
    expect(r.actions).toEqual(['REPORT', 'LOCKDOWN']);
    expect(r.cleanText).toBe('x  y');
  });

  test('no tags => no actions', () => {
    const r = parseAgentActions('normal response');
    expect(r.actions).toEqual([]);
    expect(r.cleanText).toBe('normal response');
  });
});
