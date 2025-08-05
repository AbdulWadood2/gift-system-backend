import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { AppName } from '../../enum/appname.enum';

export enum WithdrawalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export enum WithdrawalMethod {
  BANK_TRANSFER = 'bank_transfer',
  PAYPAL = 'paypal',
  CRYPTO = 'crypto',
  CHECK = 'check',
}

export class CreateWithdrawalDto {
  @ApiProperty({
    description: 'ID of the user requesting withdrawal',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Name of the application',
    enum: AppName,
    example: AppName.LEKLOK,
  })
  @IsEnum(AppName)
  @IsNotEmpty()
  appName: AppName;

  @ApiProperty({
    description: 'Amount to withdraw',
    example: 1000,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({
    description: 'Withdrawal method',
    enum: WithdrawalMethod,
    example: WithdrawalMethod.BANK_TRANSFER,
  })
  @IsEnum(WithdrawalMethod)
  @IsNotEmpty()
  method: WithdrawalMethod;

  @ApiProperty({
    description:
      'Account details for withdrawal (bank account, PayPal email, etc.)',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  accountDetails: string;

  @ApiPropertyOptional({
    description: 'Additional notes or instructions for the withdrawal',
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
}
