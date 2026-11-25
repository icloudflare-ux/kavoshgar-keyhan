import { describe, expect, it } from 'vitest';
import { jalaliToGregorian, parseJalaliDateTime } from '../utils/dateConverter';

describe('Jalali calendar regression cases', () => {
  it.each([
    ['1399/01/01', '2020-03-20'],
    ['1400/01/01', '2021-03-21'],
    ['1399/12/30', '2021-03-20'],
    ['1400/10/30', '2022-01-20'],
    ['1400/11/01', '2022-01-21'],
    ['1403/01/01', '2024-03-20'],
    ['۱۴۰۰/۰۱/۰۱', '2021-03-21'],
    ['01/01/1400', '2021-03-21'],
  ])('%s converts exactly to %s at UTC midnight', (input, expected) => {
    expect(jalaliToGregorian(input)?.toISOString()).toBe(`${expected}T00:00:00.000Z`);
  });

  it.each(['1400/12/30', '1400/07/31', '1400/00/01', '1400/13/01', '1400/01/00', '1400/01/32', '1400/1foo/01', '1400/1.5/01', 'invalid', ''])('rejects %s without throwing', input => {
    expect(jalaliToGregorian(input)).toBeNull();
  });

  it('preserves UTC time when parsing a birth date', () => {
    expect(parseJalaliDateTime('1399/12/30', '18:45')?.toISOString()).toBe('2021-03-20T18:45:00.000Z');
  });
});
