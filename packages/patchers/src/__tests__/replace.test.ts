import {replace} from '..';
import {createPatcherArgs} from './create-patcher-args';

describe('replace', () => {
  let patcher: jest.Mock;

  beforeEach(() => {
    patcher = jest.fn(() => 'bar');
  });

  it('calls the specified patcher', () => {
    const args = createPatcherArgs('a', 'foo');

    expect(replace('a', patcher)(args)).toEqual('bar');

    expect(patcher.mock.calls).toEqual([[args]]);
  });

  it('does not call the specified patcher', () => {
    expect(replace('a', patcher)(createPatcherArgs('b', 'foo'))).toEqual('foo');

    expect(patcher.mock.calls).toEqual([]);
  });
});
