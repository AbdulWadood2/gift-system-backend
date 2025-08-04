import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { ITransactionService } from './interface/transaction.service.interface';
import { ITransactionHelper } from './interface/transaction.helper.interface';
import { IResourceAppHelper } from '../resource-apps/interface/resource-app.helper.interface';
import { logAndThrowError } from '../utils/error.utils';

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(
    @Inject('ITransactionHelper')
    private readonly transactionHelper: ITransactionHelper,
    @Inject('IResourceAppHelper')
    private readonly resourceAppHelper: IResourceAppHelper,
  ) {}

  async getUserTransactions(
    userId: string,
    appName: string,
    page?: number,
    limit?: number,
  ): Promise<any> {
    try {
      // Validate resource app exists
      await this.resourceAppHelper.getResourceApp(appName);

      // Validate user from external app
      const userValidation = await this.resourceAppHelper.validateUser(
        appName,
        userId,
      );
      if (!userValidation.isValid) {
        throw new BadRequestException('User not found or invalid');
      }

      return await this.transactionHelper.getUserTransactions(
        userId,
        appName,
        page,
        limit,
      );
    } catch (error) {
      throw logAndThrowError('error in getUserTransactions', error);
    }
  }

  async getTransactionStats(userId: string, appName: string): Promise<any> {
    try {
      return await this.transactionHelper.getTransactionStats(userId, appName);
    } catch (error) {
      throw logAndThrowError('error in getTransactionStats', error);
    }
  }

  async getAppTransactionStats(appName: string): Promise<any> {
    try {
      return await this.transactionHelper.getAppTransactionStats(appName);
    } catch (error) {
      throw logAndThrowError('error in getAppTransactionStats', error);
    }
  }
}
