import {matchFile} from '..';

describe('matchFile', () => {
  it('matches the file', () => {
    const testCases = [
      {included: [1, 1, 1]},
      {include: [], included: [0, 0, 0]},
      {exclude: [], included: [1, 1, 1]},
      {include: ['*'], included: [1, 1, 0]},
      {exclude: ['*'], included: [0, 0, 1]},
      {include: ['!*'], included: [1, 0, 0]},
      {exclude: ['!*'], included: [0, 1, 1]},
      {include: ['*/*'], included: [0, 0, 1]},
      {exclude: ['*/*'], included: [1, 1, 0]},
      {include: ['**/*'], included: [1, 1, 1]},
      {exclude: ['**/*'], included: [0, 0, 0]},
      {include: ['*', '*/*'], included: [1, 1, 1]},
      {exclude: ['*', '*/*'], included: [0, 0, 0]},
      {include: [], exclude: [], included: [0, 0, 0]},
      {include: ['*'], exclude: ['!*'], included: [0, 1, 0]}
    ];

    for (const {included, ...globs} of testCases) {
      ['!a', '.b', 'c/d'].forEach((filename, index) => {
        expect(matchFile(globs)(filename)).toBe(Boolean(included[index]));
      });
    }
  });
});
