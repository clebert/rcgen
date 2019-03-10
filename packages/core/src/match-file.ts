import micromatch from 'micromatch';

export interface Globs {
  readonly includedFilenamePatterns?: string[];
  readonly excludedFilenamePatterns?: string[];
}

function isMatch(filename: string, pattern: string): boolean {
  return micromatch.isMatch(filename, pattern, {dot: true, nonegate: true});
}

function isIncludedFile(
  filename: string,
  includedFilenamePatterns: string[] | undefined
): boolean {
  if (!includedFilenamePatterns) {
    return true;
  }

  return includedFilenamePatterns.some(pattern => isMatch(filename, pattern));
}

function isExcludedFile(
  filename: string,
  excludedFilenamePatterns: string[] | undefined
): boolean {
  if (!excludedFilenamePatterns) {
    return false;
  }

  return excludedFilenamePatterns.some(pattern => isMatch(filename, pattern));
}

export function matchFile(filename: string, globs: Globs): boolean {
  return (
    isIncludedFile(filename, globs.includedFilenamePatterns) &&
    !isExcludedFile(filename, globs.excludedFilenamePatterns)
  );
}