import {matchFile} from '..';

describe('matchFile', () => {
  it('matches the file', () => {
    const testCases = [
      {included: [1, 1, 1]},
      {includedFilenamePatterns: [], included: [0, 0, 0]},
      {excludedFilenamePatterns: [], included: [1, 1, 1]},
      {includedFilenamePatterns: ['*'], included: [1, 1, 0]},
      {excludedFilenamePatterns: ['*'], included: [0, 0, 1]},
      {includedFilenamePatterns: ['!*'], included: [1, 0, 0]},
      {excludedFilenamePatterns: ['!*'], included: [0, 1, 1]},
      {includedFilenamePatterns: ['*/*'], included: [0, 0, 1]},
      {excludedFilenamePatterns: ['*/*'], included: [1, 1, 0]},
      {includedFilenamePatterns: ['**/*'], included: [1, 1, 1]},
      {excludedFilenamePatterns: ['**/*'], included: [0, 0, 0]},
      {includedFilenamePatterns: ['*', '*/*'], included: [1, 1, 1]},
      {excludedFilenamePatterns: ['*', '*/*'], included: [0, 0, 0]},
      {
        includedFilenamePatterns: [],
        excludedFilenamePatterns: [],
        included: [0, 0, 0]
      },
      {
        includedFilenamePatterns: ['*'],
        excludedFilenamePatterns: ['!*'],
        included: [0, 1, 0]
      }
    ];

    for (const {included, ...globs} of testCases) {
      ['!a', '.b', 'c/d'].forEach((filename, index) => {
        expect(matchFile(globs)(filename)).toBe(Boolean(included[index]));
      });
    }
  });
});
