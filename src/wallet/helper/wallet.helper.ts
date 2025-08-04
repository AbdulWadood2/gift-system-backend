import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet } from '../schema/wallet.schema';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { IWalletHelper } from '../interface/wallet.helper.interface';
import { plainToInstance } from 'class-transformer';
import { WalletDto } from '../dto/wallet.dto';

@Injectable()
export class WalletHelper implements IWalletHelper {
  constructor(@InjectModel(Wallet.name) private walletModel: Model<Wallet>) {}

  async createWallet(userId: string, appName: string): Promise<WalletDto> {
    try {
      const existingWallet = await this.walletModel.findOne({
        userId,
        appName,
      });
      if (existingWallet) {
        throw new BadRequestException(
          'Wallet already exists for this user and app',
        );
      }

      const wallet = new this.walletModel({
        userId,
        appName,
        balance: 0,
        totalEarned: 0,
        totalSpent: 0,
        totalWithdrawn: 0,
        isFrozen: false,
        isVerified: false,
      });

      const savedWallet = await wallet.save();
      return plainToInstance(WalletDto, savedWallet, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw error;
    }
  }

  async getWallet(userId: string, appName: string): Promise<WalletDto> {
    const wallet = await this.walletModel.findOne({ userId, appName });
    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }
    return plainToInstance(WalletDto, wallet, {
      excludeExtraneousValues: true,
    });
  }

  async updateWalletBalance(
    userId: string,
    appName: string,
    newBalance: number,
  ): Promise<WalletDto> {
    const updatedWallet = await this.walletModel.findOneAndUpdate(
      { userId, appName },
      {
        $set: {
          balance: newBalance,
          lastTransactionAt: new Date(),
        },
      },
      { new: true },
    );

    if (!updatedWallet) {
      throw new BadRequestException('Wallet not found');
    }

    return plainToInstance(WalletDto, updatedWallet, {
      excludeExtraneousValues: true,
    });
  }

  async freezeWallet(
    userId: string,
    appName: string,
    reason: string,
  ): Promise<WalletDto> {
    const updatedWallet = await this.walletModel.findOneAndUpdate(
      { userId, appName },
      {
        $set: {
          isFrozen: true,
          freezeReason: reason,
        },
      },
      { new: true },
    );

    if (!updatedWallet) {
      throw new BadRequestException('Wallet not found');
    }

    return plainToInstance(WalletDto, updatedWallet, {
      excludeExtraneousValues: true,
    });
  }

  async unfreezeWallet(userId: string, appName: string): Promise<WalletDto> {
    const updatedWallet = await this.walletModel.findOneAndUpdate(
      { userId, appName },
      {
        $set: {
          isFrozen: false,
          freezeReason: null,
        },
      },
      { new: true },
    );

    if (!updatedWallet) {
      throw new BadRequestException('Wallet not found');
    }

    return plainToInstance(WalletDto, updatedWallet, {
      excludeExtraneousValues: true,
    });
  }

  async getWalletWithPartial(partial: Partial<Wallet>): Promise<Wallet> {
    const filter: FilterQuery<Wallet> = Object.keys(partial).reduce(
      (acc, key) => {
        const typedKey = key as keyof Wallet;
        if (partial[typedKey] !== undefined) {
          acc[typedKey] = partial[typedKey];
        }
        return acc;
      },
      {} as FilterQuery<Wallet>,
    );

    const wallet = await this.walletModel.findOne(filter);
    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }
    return wallet.toObject();
  }

  async updateWallet(
    userId: string,
    appName: string,
    updates: Partial<Wallet>,
  ): Promise<WalletDto> {
    const updatedWallet = await this.walletModel.findOneAndUpdate(
      { userId, appName },
      { $set: updates },
      { new: true },
    );

    if (!updatedWallet) {
      throw new BadRequestException('Wallet not found');
    }

    return plainToInstance(WalletDto, updatedWallet, {
      excludeExtraneousValues: true,
    });
  }

  async isWalletFrozen(userId: string, appName: string): Promise<boolean> {
    const wallet = await this.walletModel.findOne({ userId, appName });
    if (!wallet) {
      throw new BadRequestException('Wallet not found');
    }
    return wallet.isFrozen;
  }

  async getUserWallets(userId: string): Promise<WalletDto[]> {
    const wallets = await this.walletModel.find({ userId });
    return wallets.map((wallet) =>
      plainToInstance(WalletDto, wallet, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async getWalletStats(appName: string): Promise<any> {
    const stats = await this.walletModel.aggregate([
      { $match: { appName } },
      {
        $group: {
          _id: null,
          totalWallets: { $sum: 1 },
          totalBalance: { $sum: '$balance' },
          totalEarned: { $sum: '$totalEarned' },
          totalSpent: { $sum: '$totalSpent' },
          totalWithdrawn: { $sum: '$totalWithdrawn' },
          frozenWallets: { $sum: { $cond: ['$isFrozen', 1, 0] } },
          verifiedWallets: { $sum: { $cond: ['$isVerified', 1, 0] } },
        },
      },
    ]);

    return (
      stats[0] || {
        totalWallets: 0,
        totalBalance: 0,
        totalEarned: 0,
        totalSpent: 0,
        totalWithdrawn: 0,
        frozenWallets: 0,
        verifiedWallets: 0,
      }
    );
  }
}
