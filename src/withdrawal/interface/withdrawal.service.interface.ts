import { Withdrawal } from '../schema/withdrawal.schema';
import { WithdrawalResponseDto } from '../dto/withdrawal-response.dto';

export interface IWithdrawalService {
  createWithdrawalRequest(
    userId: string,
    appName: string,
    amount: number,
  ): Promise<WithdrawalResponseDto>;
  getUserWithdrawals(
    userId: string,
    appName: string,
    page?: number,
    limit?: number,
  ): Promise<{
    withdrawals: WithdrawalResponseDto[];
    total: number;
    page: number;
    limit: number;
  }>;
  getPendingWithdrawals(
    page?: number,
    limit?: number,
  ): Promise<{
    withdrawals: WithdrawalResponseDto[];
    total: number;
    page: number;
    limit: number;
  }>;
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
  getWithdrawalStats(
    appName: string,
  ): Promise<{
    totalWithdrawals: number;
    totalAmount: number;
    averageAmount: number;
  }>;
}
