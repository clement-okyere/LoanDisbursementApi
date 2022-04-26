import { Status } from '../utils/enums';

export interface CreateLoanRequest {
  amount: number;
  status: Status;
}
