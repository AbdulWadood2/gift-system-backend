export interface ITransactionService {
  getUserTransactions(
    userId: string,
    appName: string,
    page?: number,
    limit?: number,
  ): Promise<any>;
  getTransactionStats(userId: string, appName: string): Promise<any>;
  getAppTransactionStats(appName: string): Promise<any>;
}
