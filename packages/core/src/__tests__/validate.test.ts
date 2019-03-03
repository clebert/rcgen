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
});
