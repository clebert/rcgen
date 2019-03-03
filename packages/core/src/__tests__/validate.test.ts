import {validate} from '..';

describe('validate', () => {
  it("combines multiple validation messages with an 'and'", () => {
    expect(
      validate({}, 'value', {type: 'object', required: ['foo', 'bar']})
    ).toEqual({
      validationMessage:
        "The value should have required property 'foo' and value should have required property 'bar'.",
      isValid: expect.any(Function)
    });
  });
});
