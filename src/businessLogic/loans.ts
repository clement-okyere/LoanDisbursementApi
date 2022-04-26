import * as uuid from 'uuid';

import { Loan } from '../models/loan';
import { LoanAccess } from '../dataAccess/loanAccess';
import { CreateLoanRequest } from '../requests/CreateLoanRequest';

const loanAccess = new LoanAccess();

export async function getAllLoans(): Promise<Loan[]> {
  return loanAccess.getAllLoans();
}

/**
 * Create Loan
 * @param createGroupRequest -  parsed request payload from client
 * @returns - the created loan item from DynamoDb
 */

export async function createLoan(createLoanRequest: CreateLoanRequest): Promise<Loan> {
  const itemId = uuid.v4();

  return await loanAccess.createLoan({
    id: itemId,
    ...createLoanRequest,
  });
}
