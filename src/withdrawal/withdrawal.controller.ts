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
import { WithdrawalService } from './withdrawal.service';
import { Withdrawal } from './schema/withdrawal.schema';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../enum/roles.enum';
import { AppName } from '../enum/appname.enum';

@ApiTags('Withdrawals')
@Controller('withdrawals')
export class WithdrawalController {
  constructor(
    @Inject('IWithdrawalService')
    private readonly withdrawalService: WithdrawalService,
  ) {}

  @Post('request/:appName')
  @ApiOperation({ summary: 'Create withdrawal request' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', description: 'Withdrawal amount' },
        userId: { type: 'string', description: 'User ID' },
      },
      required: ['amount', 'userId'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Withdrawal request created successfully',
    type: Withdrawal,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request or insufficient balance',
  })
  async createWithdrawalRequest(
    @Param('appName') appName: AppName,
    @Body() body: { amount: number; userId: string },
  ): Promise<Withdrawal> {
    return this.withdrawalService.createWithdrawalRequest(
      body.userId,
      appName,
      body.amount,
    );
  }

  @Get('user/:appName')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get user withdrawal history' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Withdrawal history retrieved successfully',
  })
  async getUserWithdrawals(
    @Param('appName') appName: AppName,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Req() req?: any,
  ): Promise<any> {
    return this.withdrawalService.getUserWithdrawals(
      req.user.userId,
      appName,
      page,
      limit,
    );
  }

  @Get('pending')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get pending withdrawal requests (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pending withdrawals retrieved successfully',
  })
  async getPendingWithdrawals(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<any> {
    return this.withdrawalService.getPendingWithdrawals(page, limit);
  }

  @Post('approve/:withdrawalId')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve withdrawal request (Admin only)' })
  @ApiParam({ name: 'withdrawalId', description: 'Withdrawal ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Withdrawal approved successfully',
    type: Withdrawal,
  })
  async approveWithdrawal(
    @Param('withdrawalId') withdrawalId: string,
    @Body('notes') notes?: string,
    @Req() req?: any,
  ): Promise<Withdrawal> {
    return this.withdrawalService.approveWithdrawal(
      withdrawalId,
      req.user.userId,
      notes,
    );
  }

  @Post('reject/:withdrawalId')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Reject withdrawal request (Admin only)' })
  @ApiParam({ name: 'withdrawalId', description: 'Withdrawal ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Withdrawal rejected successfully',
    type: Withdrawal,
  })
  async rejectWithdrawal(
    @Param('withdrawalId') withdrawalId: string,
    @Body('reason') reason: string,
    @Req() req?: any,
  ): Promise<Withdrawal> {
    return this.withdrawalService.rejectWithdrawal(
      withdrawalId,
      req.user.userId,
      reason,
    );
  }

  @Get('stats/:appName')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get withdrawal statistics (Admin only)' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Withdrawal statistics retrieved successfully',
  })
  async getWithdrawalStats(@Param('appName') appName: AppName): Promise<any> {
    return this.withdrawalService.getWithdrawalStats(appName);
  }
}
