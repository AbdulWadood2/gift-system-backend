import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WithdrawalStatus, WithdrawalMethod } from './create-withdrawal.dto';

export class WithdrawalResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the withdrawal',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'Withdrawal ID',
    example: 'WTH-2024-001',
  })
  withdrawalId: string;

  @ApiProperty({
    description: 'ID of the user requesting withdrawal',
    example: '507f1f77bcf86cd799439011',
  })
  userId: string;

  @ApiProperty({
    description: 'Name of the application',
    example: 'leklok',
  })
  appName: string;

  @ApiProperty({
    description: 'Amount to withdraw',
    example: 1000,
  })
  coinAmount: number;

  @ApiProperty({
    description: 'Balance before withdrawal',
    example: 5000,
  })
  balanceBefore: number;

  @ApiProperty({
    description: 'Balance after withdrawal',
    example: 4000,
  })
  balanceAfter: number;

  @ApiProperty({
    description: 'Withdrawal method',
    enum: WithdrawalMethod,
    example: WithdrawalMethod.BANK_TRANSFER,
  })
  method: WithdrawalMethod;

  @ApiProperty({
    description: 'Account details for withdrawal',
    example: 'john.doe@example.com',
  })
  accountDetails: string;

  @ApiProperty({
    description: 'Current status of the withdrawal',
    enum: WithdrawalStatus,
    example: WithdrawalStatus.PENDING,
  })
  status: WithdrawalStatus;

  @ApiPropertyOptional({
    description: 'Additional notes or instructions',
    example: 'Please transfer to my primary bank account',
  })
  notes?: string;

  @ApiPropertyOptional({
    description: 'Reference number or transaction ID',
    example: 'WTH-2024-001',
  })
  referenceNumber?: string;

  @ApiPropertyOptional({
    description: 'Admin notes for approval/rejection',
    example: 'Approved after verification',
  })
  adminNotes?: string;

  @ApiPropertyOptional({
    description: 'Admin user ID who reviewed the withdrawal',
    example: '507f1f77bcf86cd799439011',
  })
  adminUserId?: string;

  @ApiPropertyOptional({
    description: 'Date when withdrawal was reviewed',
    example: '2024-01-15T10:30:00.000Z',
  })
  reviewedAt?: Date;

  @ApiPropertyOptional({
    description: 'Review notes from admin',
    example: 'Approved after verification',
  })
  reviewNotes?: string;

  @ApiPropertyOptional({
    description: 'Reason for rejection if applicable',
    example: 'Insufficient verification',
  })
  rejectionReason?: string;

  @ApiPropertyOptional({
    description: 'Transaction ID from payment processor',
    example: 'txn_1234567890',
  })
  transactionId?: string;

  @ApiPropertyOptional({
    description: 'Processing fee charged',
    example: 25,
  })
  processingFee?: number;

  @ApiPropertyOptional({
    description: 'Date when withdrawal was processed',
    example: '2024-01-15T10:30:00.000Z',
  })
  processedAt?: Date;

  @ApiProperty({
    description: 'When the withdrawal was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the withdrawal was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
