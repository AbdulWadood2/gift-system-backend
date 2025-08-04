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

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject('ITransactionService')
    private readonly transactionService: TransactionService,
  ) {}

  @Get('user/:appName')
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
  async getUserTransactions(
    @Param('appName') appName: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Req() req?: any,
  ): Promise<any> {
    return this.transactionService.getUserTransactions(
      req.user.userId,
      appName,
      page,
      limit,
    );
  }

  @Get('stats/user/:appName')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get user transaction statistics' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transaction statistics retrieved successfully',
  })
  async getUserTransactionStats(
    @Param('appName') appName: string,
    @Req() req: any,
  ): Promise<any> {
    return this.transactionService.getTransactionStats(
      req.user.userId,
      appName,
    );
  }

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
  async getAppTransactionStats(
    @Param('appName') appName: string,
  ): Promise<any> {
    return this.transactionService.getAppTransactionStats(appName);
  }
}
