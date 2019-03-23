import micromatch from 'micromatch';

export type FileMatcher = (filename: string) => boolean;

export interface Globs {
  readonly include?: readonly string[];
  readonly exclude?: readonly string[];
}

function isMatch(filename: string, pattern: string): boolean {
  return micromatch.isMatch(filename, pattern, {dot: true, nonegate: true});
}

function isIncludedFile(
  filename: string,
  include: readonly string[] | undefined
): boolean {
  if (!include) {
    return true;
  }

  return include.some(pattern => isMatch(filename, pattern));
}

function isExcludedFile(
  filename: string,
  exclude: readonly string[] | undefined
): boolean {
  if (!exclude) {
    return false;
  }

  return exclude.some(pattern => isMatch(filename, pattern));
}

export function matchFile(globs: Globs): FileMatcher {
  return filename =>
    isIncludedFile(filename, globs.include) &&
    !isExcludedFile(filename, globs.exclude);
}
