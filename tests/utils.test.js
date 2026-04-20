const { clamp, randomIntInRange } = require('../utils');

describe('utils', () => {
  test('clamp keeps values in bounds', () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(-1, 1, 10)).toBe(1);
    expect(clamp(20, 1, 10)).toBe(10);
    expect(clamp(Number.NaN, 1, 10)).toBe(1);
  });

  test('randomIntInRange always returns in range', () => {
    for (let i = 0; i < 200; i += 1) {
      const value = randomIntInRange(-3, 3);
      expect(value).toBeGreaterThanOrEqual(-3);
      expect(value).toBeLessThanOrEqual(3);
      expect(Number.isInteger(value)).toBe(true);
    }
  });
});
