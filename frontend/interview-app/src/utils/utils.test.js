// frontend/interview-app/src/utils/utils.test.js

import { formatDate, getRandomItem, isPositiveNumber, truncateText } from './utils';

describe('Utils functions', () => {
    test('formatDate should format date correctly', () => {
        const dateStr = '2025-04-05T14:30:00Z';
        expect(formatDate(dateStr)).toBe('2025-04-05 14:30:00');
    });

    test('isPositiveNumber returns true for positive numbers', () => {
        expect(isPositiveNumber(10)).toBe(true);
        expect(isPositiveNumber(0.5)).toBe(true);
    });

    test('isPositiveNumber returns false for non-positive values', () => {
        expect(isPositiveNumber(0)).toBe(false);
        expect(isPositiveNumber(-5)).toBe(false);
        expect(isPositiveNumber(NaN)).toBe(false);
        expect(isPositiveNumber('not a number')).toBe(false);
    });

    test('truncateText truncates text and adds ellipsis', () => {
        expect(truncateText('Hello world!', 8)).toBe('Hello wo...');
        expect(truncateText('Short', 10)).toBe('Short');
    });

    test('getRandomItem returns item from array', () => {
        const arr = ['apple', 'banana', 'orange'];
        const result = getRandomItem(arr);
        expect(arr).toContain(result);
    });

    test('getRandomItem returns undefined for empty or invalid input', () => {
        expect(getRandomItem([])).toBeUndefined();
        expect(getRandomItem(null)).toBeUndefined();
        expect(getRandomItem('not an array')).toBeUndefined();
    });
});