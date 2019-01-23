import Ajv from 'ajv';

export type Predicate<T> = (value: unknown) => value is T;

export interface Result<T> {
  readonly isValid: Predicate<T>;
  readonly validationMessage: string;
}

export function validate<T>(
  value: unknown,
  valueName: string,
  schema: object
): Result<T> {
  const ajv = new Ajv({allErrors: true});

  ajv.addKeyword('isFunction', {
    compile: () => data => typeof data === 'function'
  });

  ajv.validate(schema, value);

  const {errors} = ajv;

  if (!errors) {
    return {
      isValid: (_value: unknown): _value is T => true,
      validationMessage: ''
    };
  }

  const messages = errors.map(
    error =>
      `${valueName}${error.dataPath} ${String(error.message).replace(
        'pass "isFunction" keyword validation',
        'be function'
      )}`
  );

  return {
    isValid: (_value: unknown): _value is T => false,
    validationMessage: `The ${messages.join(' and ')}.`
  };
}
