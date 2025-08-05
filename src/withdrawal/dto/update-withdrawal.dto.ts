import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { WithdrawalStatus, WithdrawalMethod } from './create-withdrawal.dto';

export class UpdateWithdrawalDto {
  @ApiPropertyOptional({
    description: 'Withdrawal status',
    enum: WithdrawalStatus,
    example: WithdrawalStatus.APPROVED,
  })
  @IsOptional()
  @IsEnum(WithdrawalStatus)
  status?: WithdrawalStatus;

  @ApiPropertyOptional({
    description: 'Amount to withdraw',
    example: 1000,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  amount?: number;

  @ApiPropertyOptional({
    description: 'Withdrawal method',
    enum: WithdrawalMethod,
    example: WithdrawalMethod.BANK_TRANSFER,
  })
  @IsOptional()
  @IsEnum(WithdrawalMethod)
  method?: WithdrawalMethod;

  @ApiPropertyOptional({
    description: 'Account details for withdrawal',
    example: 'john.doe@example.com',
  })
  @IsOptional()
  @IsString()
  accountDetails?: string;

  @ApiPropertyOptional({
    description: 'Additional notes or instructions',
    example: 'Please transfer to my primary bank account',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Reference number or transaction ID',
    example: 'WTH-2024-001',
  })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional({
    description: 'Admin notes for approval/rejection',
    example: 'Approved after verification',
  })
  @IsOptional()
  @IsString()
  adminNotes?: string;

  @ApiPropertyOptional({
    description: 'Transaction ID from payment processor',
    example: 'txn_1234567890',
  })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional({
    description: 'Processing fee charged',
    example: 25,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  processingFee?: number;

  @ApiPropertyOptional({
    description: 'Date when withdrawal was processed',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsOptional()
  processedAt?: Date;
}
