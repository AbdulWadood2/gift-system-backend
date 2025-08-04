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

  @Get('balance/:appName')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get user wallet balance' })
  @ApiParam({ name: 'appName', description: 'Application name' })
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
    @Req() req: any,
  ): Promise<WalletDto> {
    return this.walletService.getBalance(req.user.userId, appName);
  }

  @Post('charge')
  @ApiOperation({ summary: 'Charge user wallet with coins' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Wallet charged successfully',
    type: WalletDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request or insufficient balance',
  })
  async chargeWallet(@Body() dto: ChargeWalletDto): Promise<WalletDto> {
    return this.walletService.chargeWallet(dto);
  }

  @Post('send-gift')
  @ApiOperation({ summary: 'Send a gift to another user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gift sent successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request or insufficient balance',
  })
  async sendGift(@Body() dto: SendGiftDto): Promise<any> {
    return this.walletService.sendGift(dto);
  }

  @Get('transactions/:appName')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get user transaction history' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction history retrieved successfully',
  })
  async getTransactionHistory(
    @Param('appName') appName: AppName,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Req() req?: any,
  ): Promise<any> {
    return this.walletService.getTransactionHistory(
      req.user.userId,
      appName,
      page,
      limit,
    );
  }

  @Get('user-wallets')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all wallets for a user across apps' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User wallets retrieved successfully',
    type: [WalletDto],
  })
  async getUserWallets(@Req() req: any): Promise<WalletDto[]> {
    return this.walletService.getUserWallets(req.user.userId);
  }

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
  ): Promise<WalletDto> {
    return this.walletService.freezeWallet(userId, appName, reason);
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
  ): Promise<WalletDto> {
    return this.walletService.unfreezeWallet(userId, appName);
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
  async getWalletStats(@Param('appName') appName: AppName): Promise<any> {
    return this.walletService.getWalletStats(appName);
  }
}
