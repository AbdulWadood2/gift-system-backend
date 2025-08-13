import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Withdrawal } from '../schema/withdrawal.schema';
import { WithdrawalResponseDto } from '../dto/withdrawal-response.dto';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { IWithdrawalHelper } from '../interface/withdrawal.helper.interface';
import { WithdrawalStatus } from '../dto/create-withdrawal.dto';

@Injectable()
export class WithdrawalHelper implements IWithdrawalHelper {
  constructor(
    @InjectModel(Withdrawal.name) private withdrawalModel: Model<Withdrawal>,
  ) {}

  async createWithdrawalRequest(
    withdrawalData: Partial<Withdrawal>,
  ): Promise<WithdrawalResponseDto> {
    try {
      const withdrawal = new this.withdrawalModel(withdrawalData);
      const savedWithdrawal = await withdrawal.save();
      return plainToInstance(WithdrawalResponseDto, savedWithdrawal, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create withdrawal request');
    }
  }

  async getWithdrawalRequest(
    withdrawalId: string,
  ): Promise<WithdrawalResponseDto> {
    const withdrawal = await this.withdrawalModel.findOne({ withdrawalId });
    if (!withdrawal) {
      throw new BadRequestException('Withdrawal request not found');
    }
    return plainToInstance(WithdrawalResponseDto, withdrawal, {
      excludeExtraneousValues: true,
    });
  }

  async getUserWithdrawals(
    userId: string,
    appName: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    withdrawals: WithdrawalResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
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

    const transformedWithdrawals = plainToInstance(
      WithdrawalResponseDto,
      withdrawals,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      withdrawals: transformedWithdrawals,
      total,
      page,
      limit,
    };
  }

  async updateWithdrawalStatus(
    withdrawalId: string,
    status: string,
    adminUserId: string,
    notes?: string,
  ): Promise<WithdrawalResponseDto> {
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

    if (status === WithdrawalStatus.COMPLETED) {
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

    return plainToInstance(WithdrawalResponseDto, updatedWithdrawal, {
      excludeExtraneousValues: true,
    });
  }

  async approveWithdrawal(
    withdrawalId: string,
    adminUserId: string,
    notes?: string,
  ): Promise<WithdrawalResponseDto> {
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
  ): Promise<WithdrawalResponseDto> {
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
  ): Promise<{
    withdrawals: WithdrawalResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
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

    const transformedWithdrawals = plainToInstance(
      WithdrawalResponseDto,
      withdrawals,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      withdrawals: transformedWithdrawals,
      total,
      page,
      limit,
    };
  }

  async getWithdrawalStats(appName: string): Promise<{
    totalWithdrawals: number;
    totalAmount: number;
    averageAmount: number;
  }> {
    const stats = await this.withdrawalModel.aggregate([
      { $match: { appName } },
      {
        $group: {
          _id: null,
          totalWithdrawals: { $sum: 1 },
          totalAmount: { $sum: '$coinAmount' },
          averageAmount: { $avg: '$coinAmount' },
        },
      },
    ]);

    const result = stats[0] || {
      totalWithdrawals: 0,
      totalAmount: 0,
      averageAmount: 0,
    };

    return {
      totalWithdrawals: result.totalWithdrawals,
      totalAmount: result.totalAmount,
      averageAmount: result.averageAmount,
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
