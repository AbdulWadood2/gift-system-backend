import { Withdrawal } from '../schema/withdrawal.schema';

export interface IWithdrawalService {
  createWithdrawalRequest(
    userId: string,
    appName: string,
    amount: number,
  ): Promise<Withdrawal>;
  getUserWithdrawals(
    userId: string,
    appName: string,
    page?: number,
    limit?: number,
  ): Promise<any>;
  getPendingWithdrawals(page?: number, limit?: number): Promise<any>;
  approveWithdrawal(
    withdrawalId: string,
    adminUserId: string,
    notes?: string,
  ): Promise<Withdrawal>;
  rejectWithdrawal(
    withdrawalId: string,
    adminUserId: string,
    reason: string,
  ): Promise<Withdrawal>;
  getWithdrawalStats(appName: string): Promise<any>;
}
