import * as uuid from 'uuid';

import { Loan } from '../models/loan';
import LoanAccess from '../dataAccess/loanAccess';
import { CreateLoanRequest } from '../requests/CreateLoanRequest';

const loanAccess = new LoanAccess();

export async function getAllLoans(): Promise<Loan[]> {
  return loanAccess.getAllLoans();
}

export async function getLoan(loanId: string): Promise<Loan> {
  return loanAccess.getLoan(loanId);
}

export async function checkLoanExists(loanId: string): Promise<boolean> {
  const result = await loanAccess.getLoan(loanId);
  return !!result;
}

export async function updateLoan(
  loanId: string,
  field: string,
  value: any,
): Promise<AWS.DynamoDB.DocumentClient.UpdateItemOutput | void> {
  return loanAccess.updateLoan(loanId, field, value);
}

export async function deleteLoan(loanId: string): Promise<AWS.DynamoDB.DocumentClient.DeleteItemOutput | void> {
  return loanAccess.deleteLoan(loanId);
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
