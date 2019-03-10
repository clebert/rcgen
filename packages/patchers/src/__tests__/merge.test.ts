import {merge} from '..';
import {createPatcherArgs} from './create-patcher-args';

describe('merge', () => {
  let patcher: jest.Mock;

  beforeEach(() => {
    patcher = jest.fn(() => ({foo: {bar: [456]}, baz: 'qux'}));
  });

  it('calls the patcher', () => {
    const args = createPatcherArgs('a', {foo: {bar: [123]}});

    expect(merge('a', patcher)(args)).toEqual({
      foo: {bar: [123, 456]},
      baz: 'qux'
    });

    expect(patcher.mock.calls).toEqual([[args]]);

    expect(merge('a', () => [456])(createPatcherArgs('a', [123]))).toEqual([
      123,
      456
    ]);
  });

  it('does not call the patcher', () => {
    expect(merge('a', patcher)(createPatcherArgs('b', {}))).toEqual({});

    expect(patcher.mock.calls).toEqual([]);
  });
});
