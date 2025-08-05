import { Wallet } from '../schema/wallet.schema';
import { WalletDto } from '../dto/wallet.dto';
import { AppName } from '../../enum/appname.enum';

export interface IWalletHelper {
  createWallet(userId: string, appName: AppName): Promise<WalletDto>;
  getWallet(userId: string, appName: AppName): Promise<WalletDto>;
  updateWalletBalance(
    userId: string,
    appName: AppName,
    newBalance: number,
  ): Promise<WalletDto>;
  freezeWallet(
    userId: string,
    appName: AppName,
    reason: string,
  ): Promise<WalletDto>;
  unfreezeWallet(userId: string, appName: AppName): Promise<WalletDto>;
  getWalletWithPartial(partial: Partial<Wallet>): Promise<Wallet>;
  updateWallet(
    userId: string,
    appName: AppName,
    updates: Partial<Wallet>,
  ): Promise<WalletDto>;
  isWalletFrozen(userId: string, appName: AppName): Promise<boolean>;
  getUserWallets(userId: string): Promise<WalletDto[]>;
  getWalletStats(
    appName: AppName,
  ): Promise<{
    totalWallets: number;
    totalBalance: number;
    averageBalance: number;
  }>;
}
