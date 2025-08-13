import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { WalletDto } from './dto/wallet.dto';
import { ChargeWalletDto } from './dto/charge-wallet.dto';
import { SendGiftDto } from './dto/send-gift.dto';
import { IWalletHelper } from './interface/wallet.helper.interface';
import { IWalletService } from './interface/wallet.service.interface';
import { ITransactionHelper } from '../transaction/interface/transaction.helper.interface';
import { IGiftHelper } from '../gift/interface/gift.helper.interface';
import { IResourceAppHelper } from '../resource-apps/interface/resource-app.helper.interface';
import { logAndThrowError } from '../utils/error.utils';
import { TransactionType, TransactionStatus } from './schema/wallet.schema';
import { AppName } from '../enum/appname.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletService implements IWalletService {
  constructor(
    @Inject('IWalletHelper') private readonly walletHelper: IWalletHelper,
    @Inject('ITransactionHelper')
    private readonly transactionHelper: ITransactionHelper,
    @Inject('IGiftHelper') private readonly giftHelper: IGiftHelper,
    @Inject('IResourceAppHelper')
    private readonly resourceAppHelper: IResourceAppHelper,
  ) {}

  async getBalance(userId: string, appName: AppName): Promise<WalletDto> {
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

      return await this.walletHelper.getWallet(userId, appName);
    } catch (error) {
      throw logAndThrowError('error in getBalance', error);
    }
  }

  async chargeWallet(dto: ChargeWalletDto): Promise<WalletDto> {
    try {
      const { userId, appName, amount } = dto;

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

      // Get or create wallet
      let wallet = await this.walletHelper.getWallet(userId, appName);
      if (!wallet) {
        wallet = await this.walletHelper.createWallet(userId, appName);
      }

      // Check if wallet is frozen
      if (wallet.isFrozen) {
        throw new BadRequestException('Wallet is frozen');
      }

      // Update balance
      const newBalance = wallet.balance + amount;
      const updatedWallet = await this.walletHelper.updateWalletBalance(
        userId,
        appName,
        newBalance,
      );

      // Log transaction
      const transactionId = uuidv4();
      await this.transactionHelper.createTransaction({
        transactionId,
        userId,
        appName,
        type: TransactionType.CHARGE,
        status: TransactionStatus.COMPLETED,
        amount,
        balanceBefore: wallet.balance,
        balanceAfter: newBalance,
        description: 'Wallet charge',
        metadata: {
          chargeMethod: 'external',
          amount,
        },
      });

      return updatedWallet;
    } catch (error) {
      throw logAndThrowError('error in chargeWallet', error);
    }
  }

  async sendGift(dto: SendGiftDto): Promise<any> {
    try {
      const {
        senderUserId,
        recipientUserId,
        appName,
        giftId,
        postId,
        message,
      } = dto;

      // Validate resource app exists
      await this.resourceAppHelper.getResourceApp(appName);

      // Validate both users from external app
      const senderValidation = await this.resourceAppHelper.validateUser(
        appName,
        senderUserId,
      );
      if (!senderValidation) {
        throw new BadRequestException('Sender user not found or invalid');
      }

      const recipientValidation = await this.resourceAppHelper.validateUser(
        appName,
        recipientUserId,
      );
      if (!recipientValidation) {
        throw new BadRequestException('Recipient user not found or invalid');
      }

      // Prevent self-gifting
      if (senderUserId === recipientUserId) {
        throw new BadRequestException('Cannot send gift to yourself');
      }

      // Get gift details
      const gift = await this.giftHelper.getGift(giftId);
      if (!gift || !gift.isActive) {
        throw new BadRequestException('Invalid or inactive gift');
      }

      // Get sender wallet
      let senderWallet = await this.walletHelper.getWallet(
        senderUserId,
        appName,
      );
      if (!senderWallet) {
        senderWallet = await this.walletHelper.createWallet(
          senderUserId,
          appName,
        );
      }

      // Check if sender wallet is frozen
      if (senderWallet.isFrozen) {
        throw new BadRequestException('Sender wallet is frozen');
      }

      // Check balance
      if (senderWallet.balance < gift.coinValue) {
        throw new BadRequestException('Insufficient balance');
      }

      // Get or create recipient wallet
      let recipientWallet = await this.walletHelper.getWallet(
        recipientUserId,
        appName,
      );
      if (!recipientWallet) {
        recipientWallet = await this.walletHelper.createWallet(
          recipientUserId,
          appName,
        );
      }

      // Update balances
      const senderNewBalance = senderWallet.balance - gift.coinValue;
      const recipientNewBalance = recipientWallet.balance + gift.coinValue;

      await this.walletHelper.updateWalletBalance(
        senderUserId,
        appName,
        senderNewBalance,
      );
      await this.walletHelper.updateWalletBalance(
        recipientUserId,
        appName,
        recipientNewBalance,
      );

      // Log transactions
      const transactionId = uuidv4();
      await this.transactionHelper.createTransaction({
        transactionId,
        userId: senderUserId,
        appName,
        type: TransactionType.SEND_GIFT,
        status: TransactionStatus.COMPLETED,
        amount: -gift.coinValue,
        balanceBefore: senderWallet.balance,
        balanceAfter: senderNewBalance,
        recipientUserId,
        giftId,
        postId,
        description: `Sent ${gift.displayName} to user`,
        metadata: {
          giftName: gift.name,
          giftValue: gift.coinValue,
          postId,
          message,
        },
      });

      await this.transactionHelper.createTransaction({
        transactionId: uuidv4(),
        userId: recipientUserId,
        appName,
        type: TransactionType.RECEIVE_GIFT,
        status: TransactionStatus.COMPLETED,
        amount: gift.coinValue,
        balanceBefore: recipientWallet.balance,
        balanceAfter: recipientNewBalance,
        senderUserId,
        giftId,
        postId,
        description: `Received ${gift.displayName} from user`,
        metadata: {
          giftName: gift.name,
          giftValue: gift.coinValue,
          postId,
          message,
        },
      });

      // Send notifications to both users
      try {
        // Notify sender
        await this.resourceAppHelper.sendNotification(appName, {
          userId: senderUserId,
          title: 'Gift Sent Successfully',
          message: `You sent a ${gift.displayName} to another user 🎁`,
        });

        // Notify recipient
        await this.resourceAppHelper.sendNotification(appName, {
          userId: recipientUserId,
          title: 'Gift Received!',
          message: `You received a ${gift.displayName} from another user 🌟`,
        });
      } catch (notificationError) {
        // Log notification error but don't fail the gift transaction
        console.error('Failed to send gift notifications:', notificationError);
      }

      return {
        success: true,
        gift: {
          id: gift._id,
          name: gift.name,
          displayName: gift.displayName,
          coinValue: gift.coinValue,
        },
        senderBalance: senderNewBalance,
        recipientBalance: recipientNewBalance,
        transactionId,
      };
    } catch (error) {
      throw logAndThrowError('error in sendGift', error);
    }
  }

  async getUserWallets(userId: string): Promise<WalletDto[]> {
    try {
      return await this.walletHelper.getUserWallets(userId);
    } catch (error) {
      throw logAndThrowError('error in getUserWallets', error);
    }
  }

  async freezeWallet(
    userId: string,
    appName: AppName,
    reason: string,
  ): Promise<WalletDto> {
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

      return await this.walletHelper.freezeWallet(userId, appName, reason);
    } catch (error) {
      throw logAndThrowError('error in freezeWallet', error);
    }
  }

  async unfreezeWallet(userId: string, appName: AppName): Promise<WalletDto> {
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

      return await this.walletHelper.unfreezeWallet(userId, appName);
    } catch (error) {
      throw logAndThrowError('error in unfreezeWallet', error);
    }
  }

  async getWalletStats(appName: AppName): Promise<any> {
    try {
      // Validate resource app exists
      await this.resourceAppHelper.getResourceApp(appName);

      return await this.walletHelper.getWalletStats(appName);
    } catch (error) {
      throw logAndThrowError('error in getWalletStats', error);
    }
  }

  async getTransactionHistory(
    userId: string,
    appName: AppName,
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
      if (!userValidation) {
        throw new BadRequestException('User not found or invalid');
      }

      return await this.transactionHelper.getUserTransactions(
        userId,
        appName,
        page,
        limit,
      );
    } catch (error) {
      throw logAndThrowError('error in getTransactionHistory', error);
    }
  }
}
