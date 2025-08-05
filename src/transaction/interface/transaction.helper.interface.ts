import { Transaction } from '../schema/transaction.schema';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

export interface ITransactionHelper {
  createTransaction(
    transactionData: Partial<Transaction>,
  ): Promise<TransactionResponseDto>;
  getUserTransactions(
    userId: string,
    appName: string,
    page?: number,
    limit?: number,
  ): Promise<{
    transactions: TransactionResponseDto[];
    total: number;
    page: number;
    limit: number;
  }>;
  getTransactionById(transactionId: string): Promise<TransactionResponseDto>;
  getTransactionsByType(
    userId: string,
    appName: string,
    type: string,
  ): Promise<TransactionResponseDto[]>;
  getTransactionStats(
    userId: string,
    appName: string,
  ): Promise<{
    totalTransactions: number;
    totalAmount: number;
    averageAmount: number;
  }>;
  getAppTransactionStats(appName: string): Promise<{
    totalTransactions: number;
    totalAmount: number;
    averageAmount: number;
  }>;
}
