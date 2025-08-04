import { Transaction } from '../schema/transaction.schema';

export interface ITransactionHelper {
  createTransaction(
    transactionData: Partial<Transaction>,
  ): Promise<Transaction>;
  getUserTransactions(
    userId: string,
    appName: string,
    page?: number,
    limit?: number,
  ): Promise<any>;
  getTransactionById(transactionId: string): Promise<Transaction>;
  getTransactionsByType(
    userId: string,
    appName: string,
    type: string,
  ): Promise<Transaction[]>;
  getTransactionStats(userId: string, appName: string): Promise<any>;
  getAppTransactionStats(appName: string): Promise<any>;
}
