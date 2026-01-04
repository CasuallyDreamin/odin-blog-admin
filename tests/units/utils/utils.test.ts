import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatRelativeTime, cn } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn (Class Names)', () => {
    it('joins multiple strings', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('filters out falsy values', () => {
      const isActive = false;
      const isVisible = true;
      expect(cn('btn', isActive && 'active', isVisible && 'visible', null, undefined)).toBe('btn visible');
    });

    it('returns an empty string if no valid classes are provided', () => {
      expect(cn(false, null, undefined)).toBe('');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      const mockNow = new Date('2024-01-01T12:00:00Z');
      vi.setSystemTime(mockNow);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('returns "Just now" for very recent times', () => {
      const thirtySecondsAgo = new Date('2024-01-01T11:59:31Z');
      expect(formatRelativeTime(thirtySecondsAgo)).toBe('Just now');
    });

    it('returns minutes ago', () => {
      const fiveMinutesAgo = new Date('2024-01-01T11:55:00Z');
      expect(formatRelativeTime(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('returns hours ago', () => {
      const twoHoursAgo = new Date('2024-01-01T10:00:00Z');
      expect(formatRelativeTime(twoHoursAgo)).toBe('2 hours ago');
    });

    it('returns days ago', () => {
      const threeDaysAgo = new Date('2023-12-29T12:00:00Z');
      expect(formatRelativeTime(threeDaysAgo)).toBe('3 days ago');
    });

    it('returns months ago', () => {
      const twoMonthsAgo = new Date('2023-11-01T12:00:00Z');
      expect(formatRelativeTime(twoMonthsAgo)).toBe('2 months ago');
    });

    it('returns years ago', () => {
      const lastYear = new Date('2022-01-01T12:00:00Z');
      expect(formatRelativeTime(lastYear)).toBe('2 years ago');
    });

    it('handles singular labels correctly', () => {
      const oneHourAgo = new Date('2024-01-01T11:00:00Z');
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
    });
  });
});