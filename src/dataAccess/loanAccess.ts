import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

import { Loan } from '../models/loan';

/**
 * Abstraction to perform Loan operation from DynamoDb
 */
export class LoanAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly loanTable = process.env.LOANS_TABLE,
  ) {}

  async getAllLoans(): Promise<Loan[]> {
    console.log('Getting all loans');

    const result = await this.docClient
      .scan({
        TableName: this.loanTable,
      })
      .promise();

    const items = result.Items;
    return items as Loan[];
  }

  async createLoan(group: Loan): Promise<Loan> {
    await this.docClient
      .put({
        TableName: this.loanTable,
        Item: group,
      })
      .promise();

    return group;
  }

  async getLoan(loanId: string): Promise<Loan> {
    const result = await this.docClient
      .get({
        TableName: this.loanTable,
        Key: {
          id: loanId,
        },
      })
      .promise();

    console.log('Get Loan ', result.Item);
    return result.Item as Loan;
  }

  async deleteLoan(loanId: string) {
    const result = await this.docClient
      .delete({
        TableName: this.loanTable,
        Key: {
          id: loanId,
        },
        ReturnValues: 'ALL_OLD',
      })
      .promise();

    console.log('Get Loan ', result);
    console.log('dynamodb delete response', result.$response.data);
    return result.$response.data;
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance');
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    });
  }

  return new AWS.DynamoDB.DocumentClient();
}
