import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../schema/transaction.schema';
import { Model } from 'mongoose';
import { ITransactionHelper } from '../interface/transaction.helper.interface';

@Injectable()
export class TransactionHelper implements ITransactionHelper {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async createTransaction(
    transactionData: Partial<Transaction>,
  ): Promise<Transaction> {
    try {
      const transaction = new this.transactionModel(transactionData);
      return await transaction.save();
    } catch (error) {
      throw new BadRequestException('Failed to create transaction');
    }
  }

  async getUserTransactions(
    userId: string,
    appName: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const transactions = await this.transactionModel
      .find({ userId, appName })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await this.transactionModel.countDocuments({
      userId,
      appName,
    });

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findOne({ transactionId });
    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }
    return transaction;
  }

  async getTransactionsByType(
    userId: string,
    appName: string,
    type: string,
  ): Promise<Transaction[]> {
    return await this.transactionModel
      .find({ userId, appName, type })
      .sort({ createdAt: -1 })
      .lean();
  }

  async getTransactionStats(userId: string, appName: string): Promise<any> {
    const stats = await this.transactionModel.aggregate([
      { $match: { userId, appName } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const totalTransactions = await this.transactionModel.countDocuments({
      userId,
      appName,
    });

    return {
      totalTransactions,
      byType: stats,
    };
  }

  async getAppTransactionStats(appName: string): Promise<any> {
    const stats = await this.transactionModel.aggregate([
      { $match: { appName } },
      {
        $group: {
          _id: {
            type: '$type',
            status: '$status',
          },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ]);

    const totalTransactions = await this.transactionModel.countDocuments({
      appName,
    });

    const totalAmount = await this.transactionModel.aggregate([
      { $match: { appName } },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]);

    return {
      totalTransactions,
      totalAmount: totalAmount[0]?.total || 0,
      byTypeAndStatus: stats,
    };
  }
}
