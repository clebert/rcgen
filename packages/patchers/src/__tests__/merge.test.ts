import {merge} from '..';
import {createPatcherArgs} from './create-patcher-args';

describe('merge', () => {
  let patcher: jest.Mock;

  beforeEach(() => {
    patcher = jest.fn(() => ({foo: {bar: ['qux']}}));
  });

  it('calls the patcher', () => {
    const args = createPatcherArgs('a', {foo: {bar: ['baz']}});

    expect(merge('a', patcher)(args)).toEqual({
      foo: {bar: ['baz', 'qux']}
    });

    expect(patcher.mock.calls).toEqual([[args]]);

    expect(merge('a', patcher)(createPatcherArgs('a'))).toEqual({
      foo: {bar: ['qux']}
    });
  });

  it('does not call the patcher', () => {
    const generatedContent = {foo: {bar: ['baz']}};

    expect(merge('a', patcher)(createPatcherArgs('b', generatedContent))).toBe(
      generatedContent
    );

    expect(patcher.mock.calls).toEqual([]);

    expect(merge('a', patcher)(createPatcherArgs('b'))).toBe(undefined);
  });
});
