import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  IsDate,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppName } from '../../enum/appname.enum';

export class WalletDto {
  @Expose()
  @ApiProperty({
    description: 'ID of the wallet owner',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  userId: string;

  @Expose()
  @ApiProperty({
    description: 'Name of the application',
    enum: AppName,
    example: AppName.LEKLOK,
  })
  @IsEnum(AppName)
  appName: AppName;

  @Expose()
  @ApiProperty({
    description: 'Current wallet balance',
    example: 5000,
    minimum: 0,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  balance: number;

  @Expose()
  @ApiProperty({
    description: 'Total amount earned',
    example: 15000,
    minimum: 0,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  totalEarned: number;

  @Expose()
  @ApiProperty({
    description: 'Total amount spent',
    example: 8000,
    minimum: 0,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  totalSpent: number;

  @Expose()
  @ApiProperty({
    description: 'Total amount withdrawn',
    example: 2000,
    minimum: 0,
  })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  totalWithdrawn: number;

  @Expose()
  @ApiProperty({
    description: 'Whether the wallet is frozen',
    example: false,
  })
  @IsBoolean()
  isFrozen: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'Reason for freezing the wallet',
    example: 'Suspicious activity detected',
  })
  @IsOptional()
  @IsString()
  freezeReason?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Last transaction timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsOptional()
  @IsDate()
  lastTransactionAt?: Date;

  @Expose()
  @ApiProperty({
    description: 'Whether the wallet is verified',
    example: true,
  })
  @IsBoolean()
  isVerified: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'Verification level of the wallet',
    example: 'level_2',
  })
  @IsOptional()
  @IsString()
  verificationLevel?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'When the wallet was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @Expose()
  @ApiPropertyOptional({
    description: 'When the wallet was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
