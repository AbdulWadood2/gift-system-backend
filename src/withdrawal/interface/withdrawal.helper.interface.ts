import { Withdrawal } from '../schema/withdrawal.schema';

export interface IWithdrawalHelper {
  createWithdrawalRequest(
    withdrawalData: Partial<Withdrawal>,
  ): Promise<Withdrawal>;
  getWithdrawalRequest(withdrawalId: string): Promise<Withdrawal>;
  getUserWithdrawals(
    userId: string,
    appName: string,
    page?: number,
    limit?: number,
  ): Promise<any>;
  updateWithdrawalStatus(
    withdrawalId: string,
    status: string,
    adminUserId: string,
    notes?: string,
  ): Promise<Withdrawal>;
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
  getPendingWithdrawals(page?: number, limit?: number): Promise<any>;
  getWithdrawalStats(appName: string): Promise<any>;
  validateWithdrawalEligibility(
    userId: string,
    appName: string,
    amount: number,
  ): Promise<boolean>;
}
