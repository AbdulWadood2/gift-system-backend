import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Withdrawal } from '../schema/withdrawal.schema';
import { Model } from 'mongoose';
import { IWithdrawalHelper } from '../interface/withdrawal.helper.interface';
import { WithdrawalStatus } from '../../wallet/schema/wallet.schema';

@Injectable()
export class WithdrawalHelper implements IWithdrawalHelper {
  constructor(
    @InjectModel(Withdrawal.name) private withdrawalModel: Model<Withdrawal>,
  ) {}

  async createWithdrawalRequest(
    withdrawalData: Partial<Withdrawal>,
  ): Promise<Withdrawal> {
    try {
      const withdrawal = new this.withdrawalModel(withdrawalData);
      return await withdrawal.save();
    } catch (error) {
      throw new BadRequestException('Failed to create withdrawal request');
    }
  }

  async getWithdrawalRequest(withdrawalId: string): Promise<Withdrawal> {
    const withdrawal = await this.withdrawalModel.findOne({ withdrawalId });
    if (!withdrawal) {
      throw new BadRequestException('Withdrawal request not found');
    }
    return withdrawal;
  }

  async getUserWithdrawals(
    userId: string,
    appName: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const withdrawals = await this.withdrawalModel
      .find({ userId, appName })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await this.withdrawalModel.countDocuments({
      userId,
      appName,
    });

    return {
      withdrawals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async updateWithdrawalStatus(
    withdrawalId: string,
    status: string,
    adminUserId: string,
    notes?: string,
  ): Promise<Withdrawal> {
    const updateData: any = {
      status,
      adminUserId,
      reviewedAt: new Date(),
    };

    if (notes) {
      updateData.reviewNotes = notes;
    }

    if (status === WithdrawalStatus.REJECTED) {
      updateData.rejectionReason = notes;
    }

    if (status === WithdrawalStatus.PROCESSED) {
      updateData.processedAt = new Date();
    }

    const updatedWithdrawal = await this.withdrawalModel.findOneAndUpdate(
      { withdrawalId },
      { $set: updateData },
      { new: true },
    );

    if (!updatedWithdrawal) {
      throw new BadRequestException('Withdrawal request not found');
    }

    return updatedWithdrawal;
  }

  async approveWithdrawal(
    withdrawalId: string,
    adminUserId: string,
    notes?: string,
  ): Promise<Withdrawal> {
    const withdrawal = await this.getWithdrawalRequest(withdrawalId);

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException('Withdrawal request is not pending');
    }

    return await this.updateWithdrawalStatus(
      withdrawalId,
      WithdrawalStatus.APPROVED,
      adminUserId,
      notes,
    );
  }

  async rejectWithdrawal(
    withdrawalId: string,
    adminUserId: string,
    reason: string,
  ): Promise<Withdrawal> {
    const withdrawal = await this.getWithdrawalRequest(withdrawalId);

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException('Withdrawal request is not pending');
    }

    return await this.updateWithdrawalStatus(
      withdrawalId,
      WithdrawalStatus.REJECTED,
      adminUserId,
      reason,
    );
  }

  async getPendingWithdrawals(
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const withdrawals = await this.withdrawalModel
      .find({ status: WithdrawalStatus.PENDING })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await this.withdrawalModel.countDocuments({
      status: WithdrawalStatus.PENDING,
    });

    return {
      withdrawals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getWithdrawalStats(appName: string): Promise<any> {
    const stats = await this.withdrawalModel.aggregate([
      { $match: { appName } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$coinAmount' },
        },
      },
    ]);

    const totalWithdrawals = await this.withdrawalModel.countDocuments({
      appName,
    });
    const totalAmount = await this.withdrawalModel.aggregate([
      { $match: { appName } },
      {
        $group: {
          _id: null,
          total: { $sum: '$coinAmount' },
        },
      },
    ]);

    return {
      totalWithdrawals,
      totalAmount: totalAmount[0]?.total || 0,
      byStatus: stats,
    };
  }

  async validateWithdrawalEligibility(
    userId: string,
    appName: string,
    amount: number,
  ): Promise<boolean> {
    // Check if user has any pending withdrawals
    const pendingWithdrawals = await this.withdrawalModel.countDocuments({
      userId,
      appName,
      status: WithdrawalStatus.PENDING,
    });

    if (pendingWithdrawals > 0) {
      throw new BadRequestException(
        'You already have a pending withdrawal request',
      );
    }

    // Check minimum withdrawal amount (e.g., 100 coins)
    if (amount < 100) {
      throw new BadRequestException('Minimum withdrawal amount is 100 coins');
    }

    // Check daily withdrawal limit (e.g., 3 requests per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayWithdrawals = await this.withdrawalModel.countDocuments({
      userId,
      appName,
      createdAt: { $gte: today },
    });

    if (todayWithdrawals >= 3) {
      throw new BadRequestException(
        'Daily withdrawal limit reached (3 requests per day)',
      );
    }

    return true;
  }
}
