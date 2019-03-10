import {composeEnhancers} from '..';

describe('composeEnhancers', () => {
  it('performs a left-to-right function composition', () => {
    expect(composeEnhancers<string[]>()(['foo'])).toEqual(['foo']);

    expect(
      composeEnhancers<string[]>(
        currentValue => [...currentValue, 'bar'],
        currentValue => [...currentValue, 'baz'],
        currentValue => [...currentValue, 'qux']
      )(['foo'])
    ).toEqual(['foo', 'bar', 'baz', 'qux']);
  });
});
