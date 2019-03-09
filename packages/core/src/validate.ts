import Ajv from 'ajv';

export interface ValidationResult<T> {
  readonly validationMessage: string;

  isValid(value: unknown): value is T;
}

export function validate<T>(
  value: unknown,
  valueName: string,
  schema: object,
  customLogger?: Ajv.CustomLogger
): ValidationResult<T> {
  const ajv = new Ajv({
    allErrors: true,
    schemaId: 'auto',
    logger: customLogger || false
  });

  // tslint:disable-next-line: no-require-imports
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));

  // tslint:disable-next-line: no-require-imports
  ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));

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
