import * as Joi from 'joi';

interface ILoanSchema {
  amount: number;
  status: string;
}

const loanSchema: Joi.ObjectSchema<ILoanSchema> = Joi.object({
  amount: Joi.number().required(),
  status: Joi.string().required(),
});

export default loanSchema;
