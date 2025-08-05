import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppName } from '../../enum/appname.enum';

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  WITHDRAWAL = 'withdrawal',
  GIFT_SENT = 'gift_sent',
  GIFT_RECEIVED = 'gift_received',
  REFUND = 'refund',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export class TransactionResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the transaction',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'ID of the user involved in the transaction',
    example: '507f1f77bcf86cd799439011',
  })
  userId: string;

  @ApiProperty({
    description: 'Name of the application',
    enum: AppName,
    example: AppName.LEKLOK,
  })
  appName: AppName;

  @ApiProperty({
    description: 'Type of transaction',
    enum: TransactionType,
    example: TransactionType.CREDIT,
  })
  type: TransactionType;

  @ApiProperty({
    description: 'Amount of the transaction',
    example: 1000,
  })
  amount: number;

  @ApiProperty({
    description: 'Current status of the transaction',
    enum: TransactionStatus,
    example: TransactionStatus.COMPLETED,
  })
  status: TransactionStatus;

  @ApiPropertyOptional({
    description: 'Description of the transaction',
    example: 'Wallet recharge via credit card',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Reference number or transaction ID',
    example: 'TXN-2024-001',
  })
  referenceNumber?: string;

  @ApiPropertyOptional({
    description: 'Related transaction ID (for refunds, etc.)',
    example: '507f1f77bcf86cd799439012',
  })
  relatedTransactionId?: string;

  @ApiPropertyOptional({
    description: 'Metadata for the transaction',
    example: {
      giftId: '507f1f77bcf86cd799439013',
      recipientId: '507f1f77bcf86cd799439014',
    },
  })
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Error message if transaction failed',
    example: 'Insufficient funds',
  })
  errorMessage?: string;

  @ApiProperty({
    description: 'When the transaction was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the transaction was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
