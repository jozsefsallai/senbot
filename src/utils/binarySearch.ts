const recurse = <T>(
  haystack: T[],
  needle: T,
  low: number,
  high: number,
): boolean => {
  if (low > high) {
    return false;
  }

  const mid = Math.floor((low + high) / 2);

  if (haystack[mid] === needle) {
    return true;
  }

  return haystack[mid] > needle
    ? recurse(haystack, needle, low, mid - 1)
    : recurse(haystack, needle, mid + 1, high);
};

export const binarySearch = <T = any>(haystack: T[], needle: T): boolean =>
  recurse(haystack, needle, 0, haystack.length - 1);
