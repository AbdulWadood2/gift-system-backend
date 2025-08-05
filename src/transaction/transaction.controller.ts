import {
  Controller,
  Get,
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
import { TransactionService } from './transaction.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../enum/roles.enum';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject('ITransactionService')
    private readonly transactionService: TransactionService,
  ) {}

  @Get('user/:appName/:userId')
  @ApiOperation({ summary: 'Get user transaction history' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction history retrieved successfully',
    type: [TransactionResponseDto],
  })
  async getUserTransactions(
    @Param('appName') appName: string,
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{
    data: {
      transactions: TransactionResponseDto[];
      total: number;
      page: number;
      limit: number;
    };
  }> {
    const result = await this.transactionService.getUserTransactions(
      userId,
      appName,
      page,
      limit,
    );
    return { data: result };
  }

  @Get('stats/user/:appName/:userId')
  @ApiOperation({ summary: 'Get user transaction statistics' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction statistics retrieved successfully',
  })
  async getUserTransactionStats(
    @Param('appName') appName: string,
    @Param('userId') userId: string,
  ): Promise<{
    data: {
      totalTransactions: number;
      totalAmount: number;
      averageAmount: number;
    };
  }> {
    const result = await this.transactionService.getTransactionStats(
      userId,
      appName,
    );
    return { data: result };
  }

  // Admin endpoint
  @Get('stats/app/:appName')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get app transaction statistics (Admin only)' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'App transaction statistics retrieved successfully',
  })
  async getAppTransactionStats(@Param('appName') appName: string): Promise<{
    data: {
      totalTransactions: number;
      totalAmount: number;
      averageAmount: number;
    };
  }> {
    const result =
      await this.transactionService.getAppTransactionStats(appName);
    return { data: result };
  }
}
