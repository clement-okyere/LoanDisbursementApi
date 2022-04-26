import {Status} from '../utils/enums'

export interface Loan {
    id: string
    amount: number
    status: Status
  }