import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppName } from '../../enum/appname.enum';

export class ChargeWalletDto {
  @Expose()
  @ApiProperty({
    description: 'ID of the user whose wallet to charge',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Expose()
  @ApiProperty({
    description: 'Name of the application',
    enum: AppName,
    example: AppName.LEKLOK,
  })
  @IsEnum(AppName)
  @IsNotEmpty()
  appName: AppName;

  @Expose()
  @ApiProperty({
    description: 'Amount to charge the wallet',
    example: 1000,
    minimum: 1,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  amount: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Payment gateway used for the transaction',
    example: 'stripe',
  })
  @IsOptional()
  @IsString()
  paymentGateway?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Payment transaction ID from the gateway',
    example: 'txn_1234567890',
  })
  @IsOptional()
  @IsString()
  paymentTransactionId?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Description of the charge',
    example: 'Wallet recharge via credit card',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
