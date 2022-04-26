import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { Loan } from '../models/loan'

export class LoanAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly loanTable = process.env.LOANS_TABLE) {
  }

  async getAllLoans(): Promise<Loan[]> {
    console.log('Getting all loans')

    const result = await this.docClient.scan({
      TableName: this.loanTable
    }).promise()

    const items = result.Items
    return items as Loan[]
  }

  async createLoan(group: Loan): Promise<Loan> {
    await this.docClient.put({
      TableName: this.loanTable,
      Item: group
    }).promise()

    return group
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}