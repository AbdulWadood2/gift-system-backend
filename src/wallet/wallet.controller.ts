import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { ChargeWalletDto } from './dto/charge-wallet.dto';
import { SendGiftDto } from './dto/send-gift.dto';
import { WalletDto } from './dto/wallet.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../enum/roles.enum';
import { AppName } from '../enum/appname.enum';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    @Inject('IWalletService')
    private readonly walletService: WalletService,
  ) {}

  @Get('balance/:appName/:userId')
  @ApiOperation({ summary: 'Get user wallet balance' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet balance retrieved successfully',
    type: WalletDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User or wallet not found',
  })
  async getBalance(
    @Param('appName') appName: AppName,
    @Param('userId') userId: string,
  ): Promise<{ data: WalletDto }> {
    const result = await this.walletService.getBalance(userId, appName);
    return { data: result };
  }

  @Post('charge')
  @ApiOperation({ summary: 'Charge user wallet with coins' })
  @ApiBody({ type: ChargeWalletDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet charged successfully',
    type: WalletDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request or insufficient balance',
  })
  async chargeWallet(
    @Body() dto: ChargeWalletDto,
  ): Promise<{ data: WalletDto }> {
    const result = await this.walletService.chargeWallet(dto);
    return { data: result };
  }

  @Post('send-gift')
  @ApiOperation({ summary: 'Send a gift to another user' })
  @ApiBody({ type: SendGiftDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gift sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request or insufficient balance',
  })
  async sendGift(
    @Body() dto: SendGiftDto,
  ): Promise<{ data: { success: boolean; transactionId: string } }> {
    const result = await this.walletService.sendGift(dto);
    return { data: result };
  }

  @Get('transactions/:appName/:userId')
  @ApiOperation({ summary: 'Get user transaction history' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction history retrieved successfully',
  })
  async getTransactionHistory(
    @Param('appName') appName: AppName,
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{
    data: { transactions: any[]; total: number; page: number; limit: number };
  }> {
    const result = await this.walletService.getTransactionHistory(
      userId,
      appName,
      page,
      limit,
    );
    return { data: result };
  }

  @Get('user-wallets/:userId')
  @ApiOperation({ summary: 'Get all wallets for a user across apps' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User wallets retrieved successfully',
    type: [WalletDto],
  })
  async getUserWallets(
    @Param('userId') userId: string,
  ): Promise<{ data: WalletDto[] }> {
    const result = await this.walletService.getUserWallets(userId);
    return { data: result };
  }

  // Admin endpoints
  @Post('freeze/:userId/:appName')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Freeze user wallet (Admin only)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet frozen successfully',
    type: WalletDto,
  })
  async freezeWallet(
    @Param('userId') userId: string,
    @Param('appName') appName: AppName,
    @Body('reason') reason: string,
  ): Promise<{ data: WalletDto }> {
    const result = await this.walletService.freezeWallet(
      userId,
      appName,
      reason,
    );
    return { data: result };
  }

  @Post('unfreeze/:userId/:appName')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Unfreeze user wallet (Admin only)' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet unfrozen successfully',
    type: WalletDto,
  })
  async unfreezeWallet(
    @Param('userId') userId: string,
    @Param('appName') appName: AppName,
  ): Promise<{ data: WalletDto }> {
    const result = await this.walletService.unfreezeWallet(userId, appName);
    return { data: result };
  }

  @Get('stats/:appName')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get wallet statistics (Admin only)' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet statistics retrieved successfully',
  })
  async getWalletStats(
    @Param('appName') appName: AppName,
  ): Promise<{
    data: {
      totalWallets: number;
      totalBalance: number;
      averageBalance: number;
    };
  }> {
    const result = await this.walletService.getWalletStats(appName);
    return { data: result };
  }
}
