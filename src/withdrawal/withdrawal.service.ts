import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { Withdrawal } from './schema/withdrawal.schema';
import { WithdrawalResponseDto } from './dto/withdrawal-response.dto';
import { IWithdrawalService } from './interface/withdrawal.service.interface';
import { IWithdrawalHelper } from './interface/withdrawal.helper.interface';
import { IWalletHelper } from '../wallet/interface/wallet.helper.interface';
import { IResourceAppHelper } from '../resource-apps/interface/resource-app.helper.interface';
import { WithdrawalStatus } from '../wallet/schema/wallet.schema';
import { AppName } from '../enum/appname.enum';
import { logAndThrowError } from '../utils/error.utils';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WithdrawalService implements IWithdrawalService {
  constructor(
    @Inject('IWithdrawalHelper')
    private readonly withdrawalHelper: IWithdrawalHelper,
    @Inject('IWalletHelper')
    private readonly walletHelper: IWalletHelper,
    @Inject('IResourceAppHelper')
    private readonly resourceAppHelper: IResourceAppHelper,
  ) {}

  async createWithdrawalRequest(
    userId: string,
    appName: AppName,
    amount: number,
  ): Promise<WithdrawalResponseDto> {
    try {
      // Validate resource app exists
      await this.resourceAppHelper.getResourceApp(appName);

      // Validate user from external app
      const userValidation = await this.resourceAppHelper.validateUser(
        appName,
        userId,
      );
      if (!userValidation) {
        throw new BadRequestException('User not found or invalid');
      }

      // Check user verification status - CRITICAL SECURITY CHECK
      const verificationStatus =
        await this.resourceAppHelper.checkUserVerification(appName, userId);
      if (!verificationStatus.isEligible) {
        throw new BadRequestException(
          'User verification required for withdrawals',
        );
      }

      // Get wallet to check balance
      const wallet = await this.walletHelper.getWallet(userId, appName);
      if (!wallet) {
        throw new BadRequestException('Wallet not found');
      }

      if (wallet.isFrozen) {
        throw new BadRequestException('Wallet is frozen');
      }

      if (wallet.balance < amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Validate withdrawal eligibility
      const isEligible =
        await this.withdrawalHelper.validateWithdrawalEligibility(
          userId,
          appName,
          amount,
        );
      if (!isEligible) {
        throw new BadRequestException('Withdrawal request not eligible');
      }

      // Create withdrawal request
      const withdrawal = await this.withdrawalHelper.createWithdrawalRequest({
        withdrawalId: uuidv4(),
        userId,
        appName,
        coinAmount: amount,
        balanceBefore: wallet.balance,
        balanceAfter: wallet.balance - amount,
        metadata: {
          walletBalance: wallet.balance,
          requestSource: 'api',
          userVerificationStatus: verificationStatus,
        },
      });

      // Send notification to user about withdrawal request
      await this.resourceAppHelper.sendNotification(appName, {
        userId,
        title: 'Withdrawal Request Submitted',
        message: `Your withdrawal request for ${amount} coins has been submitted and is under review.`,
      });

      return withdrawal;
    } catch (error) {
      throw logAndThrowError('error in createWithdrawalRequest', error);
    }
  }

  async getUserWithdrawals(
    userId: string,
    appName: AppName,
    page?: number,
    limit?: number,
  ): Promise<{
    withdrawals: WithdrawalResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      return await this.withdrawalHelper.getUserWithdrawals(
        userId,
        appName,
        page,
        limit,
      );
    } catch (error) {
      throw logAndThrowError('error in getUserWithdrawals', error);
    }
  }

  async getPendingWithdrawals(
    page?: number,
    limit?: number,
  ): Promise<{
    withdrawals: WithdrawalResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      return await this.withdrawalHelper.getPendingWithdrawals(page, limit);
    } catch (error) {
      throw logAndThrowError('error in getPendingWithdrawals', error);
    }
  }

  async approveWithdrawal(
    withdrawalId: string,
    adminUserId: string,
    notes?: string,
  ): Promise<WithdrawalResponseDto> {
    try {
      const withdrawal = await this.withdrawalHelper.approveWithdrawal(
        withdrawalId,
        adminUserId,
        notes,
      );

      // Send notification to user about approved withdrawal
      await this.resourceAppHelper.sendNotification(withdrawal.appName, {
        userId: withdrawal.userId,
        title: 'Withdrawal Approved',
        message: `Your withdrawal request for ${withdrawal.coinAmount} coins has been approved and will be processed soon.`,
      });

      return withdrawal;
    } catch (error) {
      throw logAndThrowError('error in approveWithdrawal', error);
    }
  }

  async rejectWithdrawal(
    withdrawalId: string,
    adminUserId: string,
    reason: string,
  ): Promise<WithdrawalResponseDto> {
    try {
      const withdrawal = await this.withdrawalHelper.rejectWithdrawal(
        withdrawalId,
        adminUserId,
        reason,
      );

      // Send notification to user about rejected withdrawal
      await this.resourceAppHelper.sendNotification(withdrawal.appName, {
        userId: withdrawal.userId,
        title: 'Withdrawal Rejected',
        message: `Your withdrawal request for ${withdrawal.coinAmount} coins has been rejected. Reason: ${reason}`,
      });

      return withdrawal;
    } catch (error) {
      throw logAndThrowError('error in rejectWithdrawal', error);
    }
  }

  async getWithdrawalStats(appName: AppName): Promise<{
    totalWithdrawals: number;
    totalAmount: number;
    averageAmount: number;
  }> {
    try {
      return await this.withdrawalHelper.getWithdrawalStats(appName);
    } catch (error) {
      throw logAndThrowError('error in getWithdrawalStats', error);
    }
  }
}
