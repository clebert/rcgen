import {validate} from '..';

describe('validate', () => {
  it("combines multiple validation messages with an 'and'", () => {
    const validationResult = validate({}, 'value', {
      type: 'object',
      required: ['foo', 'bar']
    });

    expect(validationResult.validationMessage).toBe(
      "The value should have required property 'foo' and value should have required property 'bar'."
    );
  });

  it('does not support draft-03 JSON schema', () => {
    expect(() =>
      validate({}, 'value', {
        $schema: 'http://json-schema.org/draft-03/schema#',
        type: 'object'
      })
    ).toThrowError(
      new Error(
        'no schema with key or ref "http://json-schema.org/draft-03/schema#"'
      )
    );
  });

  it('supports draft-04 JSON schema', () => {
    expect(() =>
      validate({}, 'value', {
        $schema: 'http://json-schema.org/draft-04/schema#',
        type: 'object'
      })
    ).not.toThrowError();
  });

  it('supports draft-06 JSON schema', () => {
    expect(() =>
      validate({}, 'value', {
        $schema: 'http://json-schema.org/draft-06/schema#',
        type: 'object'
      })
    ).not.toThrowError();
  });

  it('supports draft-07 JSON schema', () => {
    expect(() =>
      validate({}, 'value', {
        $schema: 'http://json-schema.org/draft-07/schema#',
        type: 'object'
      })
    ).not.toThrowError();
  });

  it('only logs using the optional custom logger', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    const customLogger = {log: jest.fn(), warn: jest.fn(), error: jest.fn()};

    const schema = {
      $ref: '#/definitions',
      definitions: {},
      additionalProperties: false
    };

    try {
      validate({}, 'value', schema);
      validate({}, 'value', schema, customLogger);

      expect(consoleWarnSpy.mock.calls).toEqual([]);

      expect(customLogger.warn.mock.calls).toEqual([
        ['$ref: keywords ignored in schema at path "#"']
      ]);
    } finally {
      consoleWarnSpy.mockRestore();
    }
  });
});
