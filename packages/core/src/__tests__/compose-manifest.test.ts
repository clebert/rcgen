import {composeManifest} from '..';

describe('composeManifest', () => {
  it('performs a left-to-right function composition', () => {
    expect.assertions(6);

    const manifest0 = {};

    expect(composeManifest()(manifest0)).toBe(manifest0);

    const manifest1 = {};

    const mockManifestCreator1 = jest.fn(initialManifest => {
      expect(initialManifest).toBe(manifest0);

      return manifest1;
    });

    expect(composeManifest(mockManifestCreator1)(manifest0)).toBe(manifest1);

    const manifest2 = {};

    const mockManifestCreator2 = jest.fn(initialManifest => {
      expect(initialManifest).toBe(manifest1);

      return manifest2;
    });

    expect(
      composeManifest(mockManifestCreator1, mockManifestCreator2)(manifest0)
    ).toBe(manifest2);
  });

  it('creates an empty default manifest', () => {
    expect.assertions(3);

    expect(composeManifest()()).toEqual({});

    const mockManifestCreator = jest.fn(initialManifest => {
      expect(initialManifest).toEqual({});

      return initialManifest;
    });

    expect(composeManifest(mockManifestCreator)()).toEqual({});
  });
});
