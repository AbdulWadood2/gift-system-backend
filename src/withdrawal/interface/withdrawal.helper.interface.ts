import { Withdrawal } from '../schema/withdrawal.schema';

import { WithdrawalResponseDto } from '../dto/withdrawal-response.dto';

export interface IWithdrawalHelper {
  createWithdrawalRequest(
    withdrawalData: Partial<Withdrawal>,
  ): Promise<WithdrawalResponseDto>;
  getWithdrawalRequest(withdrawalId: string): Promise<WithdrawalResponseDto>;
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
  ): Promise<WithdrawalResponseDto>;
  approveWithdrawal(
    withdrawalId: string,
    adminUserId: string,
    notes?: string,
  ): Promise<WithdrawalResponseDto>;
  rejectWithdrawal(
    withdrawalId: string,
    adminUserId: string,
    reason: string,
  ): Promise<WithdrawalResponseDto>;
  getPendingWithdrawals(page?: number, limit?: number): Promise<any>;
  getWithdrawalStats(appName: string): Promise<any>;
  validateWithdrawalEligibility(
    userId: string,
    appName: string,
    amount: number,
  ): Promise<boolean>;
}
