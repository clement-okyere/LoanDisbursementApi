import * as Joi from 'joi';
import { Status } from '../utils/enums';

interface ILoanSchema {
  amount: number;
  status: string;
}

type IPatchLoanSchema = Omit<ILoanSchema, 'amount'>;

export const loanSchema: Joi.ObjectSchema<ILoanSchema> = Joi.object({
  amount: Joi.number().required(),
  status: Joi.string()
    .required()
    .valid(...Object.values(Status)),
});

/**
 * Schema for validating loan status update
 */
export const patchedLoanSchema: Joi.ObjectSchema<IPatchLoanSchema> = Joi.object({
  status: Joi.string()
    .required()
    .valid(...Object.values(Status)),
});
