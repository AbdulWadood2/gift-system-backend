import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from '../schema/transaction.schema';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { ITransactionHelper } from '../interface/transaction.helper.interface';

@Injectable()
export class TransactionHelper implements ITransactionHelper {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) {}

  async createTransaction(
    transactionData: Partial<Transaction>,
  ): Promise<TransactionResponseDto> {
    try {
      const transaction = new this.transactionModel(transactionData);
      const savedTransaction = await transaction.save();
      return plainToInstance(TransactionResponseDto, savedTransaction, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create transaction');
    }
  }

  async getUserTransactions(
    userId: string,
    appName: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{
    transactions: TransactionResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
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

    const transformedTransactions = plainToInstance(TransactionResponseDto, transactions, {
      excludeExtraneousValues: true,
    });

    return {
      transactions: transformedTransactions,
      total,
      page,
      limit,
    };
  }

  async getTransactionById(transactionId: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionModel.findOne({ transactionId });
    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }
    return plainToInstance(TransactionResponseDto, transaction, {
      excludeExtraneousValues: true,
    });
  }

  async getTransactionsByType(
    userId: string,
    appName: string,
    type: string,
  ): Promise<TransactionResponseDto[]> {
    const transactions = await this.transactionModel
      .find({ userId, appName, type })
      .sort({ createdAt: -1 })
      .lean();
    
    return plainToInstance(TransactionResponseDto, transactions, {
      excludeExtraneousValues: true,
    });
  }

  async getTransactionStats(userId: string, appName: string): Promise<{
    totalTransactions: number;
    totalAmount: number;
    averageAmount: number;
  }> {
    const stats = await this.transactionModel.aggregate([
      { $match: { userId, appName } },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
        },
      },
    ]);

    const result = stats[0] || { totalTransactions: 0, totalAmount: 0, averageAmount: 0 };

    return {
      totalTransactions: result.totalTransactions,
      totalAmount: result.totalAmount,
      averageAmount: result.averageAmount,
    };
  }

  async getAppTransactionStats(appName: string): Promise<{
    totalTransactions: number;
    totalAmount: number;
    averageAmount: number;
  }> {
    const stats = await this.transactionModel.aggregate([
      { $match: { appName } },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
        },
      },
    ]);

    const result = stats[0] || { totalTransactions: 0, totalAmount: 0, averageAmount: 0 };

    return {
      totalTransactions: result.totalTransactions,
      totalAmount: result.totalAmount,
      averageAmount: result.averageAmount,
    };
  }
}
