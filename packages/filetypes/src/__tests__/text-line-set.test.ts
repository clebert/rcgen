import {TextLineSet} from '..';

describe('TextLineSet', () => {
  let textLineSet: TextLineSet;

  beforeEach(() => {
    textLineSet = new TextLineSet();
  });

  describe('#addTextLine', () => {
    it('adds non-existent text lines after trimming', () => {
      textLineSet
        .addTextLine('a')
        .addTextLine(' a ')
        .addTextLine(' b ');

      expect(textLineSet.getTextLines()).toEqual(['a', 'b']);
    });

    it('does not add blank text lines', () => {
      textLineSet.addTextLine(' ').addTextLine('\n\r');

      expect(textLineSet.getTextLines()).toEqual([]);
    });
  });

  describe('#getTextLines', () => {
    it('returns sorted text lines', () => {
      textLineSet
        .addTextLine('c')
        .addTextLine('a')
        .addTextLine('b');

      expect(textLineSet.getTextLines()).toEqual(['a', 'b', 'c']);
    });

    it('does not return text lines if none have been added', () => {
      expect(textLineSet.getTextLines()).toEqual([]);
    });
  });
});
