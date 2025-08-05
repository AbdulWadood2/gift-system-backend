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
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from './dto/update-withdrawal.dto';
import { WithdrawalResponseDto } from './dto/withdrawal-response.dto';

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
  @ApiBody({ type: CreateWithdrawalDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Withdrawal request created successfully',
    type: WithdrawalResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request or insufficient balance',
  })
  async createWithdrawalRequest(
    @Param('appName') appName: AppName,
    @Body() body: CreateWithdrawalDto,
  ): Promise<{ data: WithdrawalResponseDto }> {
    const result = await this.withdrawalService.createWithdrawalRequest(
      body.userId,
      appName,
      body.amount,
    );
    return { data: result };
  }

  @Get('user/:appName/:userId')
  @ApiOperation({ summary: 'Get user withdrawal history' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Withdrawal history retrieved successfully',
  })
  async getUserWithdrawals(
    @Param('appName') appName: AppName,
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{
    data: {
      withdrawals: WithdrawalResponseDto[];
      total: number;
      page: number;
      limit: number;
    };
  }> {
    const result = await this.withdrawalService.getUserWithdrawals(
      userId,
      appName,
      page,
      limit,
    );
    return { data: result };
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
  ): Promise<{
    data: {
      withdrawals: WithdrawalResponseDto[];
      total: number;
      page: number;
      limit: number;
    };
  }> {
    const result = await this.withdrawalService.getPendingWithdrawals(
      page,
      limit,
    );
    return { data: result };
  }

  @Post('approve/:withdrawalId')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Approve withdrawal request (Admin only)' })
  @ApiParam({ name: 'withdrawalId', description: 'Withdrawal ID' })
  @ApiBody({ type: UpdateWithdrawalDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Withdrawal approved successfully',
    type: WithdrawalResponseDto,
  })
  async approveWithdrawal(
    @Param('withdrawalId') withdrawalId: string,
    @Body() body: UpdateWithdrawalDto,
    @Req() req?: any,
  ): Promise<{ data: WithdrawalResponseDto }> {
    const result = await this.withdrawalService.approveWithdrawal(
      withdrawalId,
      req.user.userId,
      body.adminNotes || '',
    );
    return { data: result };
  }

  @Post('reject/:withdrawalId')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Reject withdrawal request (Admin only)' })
  @ApiParam({ name: 'withdrawalId', description: 'Withdrawal ID' })
  @ApiBody({ type: UpdateWithdrawalDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Withdrawal rejected successfully',
    type: WithdrawalResponseDto,
  })
  async rejectWithdrawal(
    @Param('withdrawalId') withdrawalId: string,
    @Body() body: UpdateWithdrawalDto,
    @Req() req?: any,
  ): Promise<{ data: WithdrawalResponseDto }> {
    const result = await this.withdrawalService.rejectWithdrawal(
      withdrawalId,
      req.user.userId,
      body.adminNotes || '',
    );
    return { data: result };
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
  async getWithdrawalStats(@Param('appName') appName: AppName): Promise<{
    data: {
      totalWithdrawals: number;
      totalAmount: number;
      averageAmount: number;
    };
  }> {
    const result = await this.withdrawalService.getWithdrawalStats(appName);
    return { data: result };
  }
}
