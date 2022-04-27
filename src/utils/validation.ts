interface IValidate {
  valid: boolean;
  message?: string;
}

export const validate = (schema, model): IValidate => {
  const { error } = schema.validate(model);
  if (error)
    return {
      valid: false,
      message: getErrorMessage(error),
    };

  return {
    valid: true,
  };
};

export const getErrorMessage = (error): string => {
  const { details } = error;
  return details.map((d) => d.message).join(' ');
};
