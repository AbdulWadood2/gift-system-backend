import { WalletDto } from '../dto/wallet.dto';
import { ChargeWalletDto } from '../dto/charge-wallet.dto';
import { SendGiftDto } from '../dto/send-gift.dto';
import { AppName } from '../../enum/appname.enum';

export interface IWalletService {
  getBalance(userId: string, appName: AppName): Promise<WalletDto>;
  chargeWallet(dto: ChargeWalletDto): Promise<WalletDto>;
  sendGift(
    dto: SendGiftDto,
  ): Promise<{ success: boolean; transactionId: string }>;
  getTransactionHistory(
    userId: string,
    appName: AppName,
    page?: number,
    limit?: number,
  ): Promise<{
    transactions: any[];
    total: number;
    page: number;
    limit: number;
  }>;
  getUserWallets(userId: string): Promise<WalletDto[]>;
  freezeWallet(
    userId: string,
    appName: AppName,
    reason: string,
  ): Promise<WalletDto>;
  unfreezeWallet(userId: string, appName: AppName): Promise<WalletDto>;
  getWalletStats(
    appName: AppName,
  ): Promise<{
    totalWallets: number;
    totalBalance: number;
    averageBalance: number;
  }>;
}
