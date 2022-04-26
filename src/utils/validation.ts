interface IValidate {
  success: boolean;
  message?: string;
}

export const validate = (schema, model): IValidate => {
  const { error } = schema.validate(model);
  if (error)
    return {
      success: false,
      message: getErrorMessage(error),
    };

  return {
    success: true,
  };
};

export const getErrorMessage = (error): string => {
  const { details } = error;
  return details.map((d) => d.message).join(' ');
};
