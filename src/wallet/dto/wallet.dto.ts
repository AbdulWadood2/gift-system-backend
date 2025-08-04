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
import { AppName } from '../../enum/appname.enum';

export class WalletDto {
  @Expose()
  @IsString()
  userId: string;

  @Expose()
  @IsEnum(AppName)
  appName: AppName;

  @Expose()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  balance: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  totalEarned: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  totalSpent: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  totalWithdrawn: number;

  @Expose()
  @IsBoolean()
  isFrozen: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  freezeReason?: string;

  @Expose()
  @IsOptional()
  @IsDate()
  lastTransactionAt?: Date;

  @Expose()
  @IsBoolean()
  isVerified: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  verificationLevel?: string;

  @Expose()
  @IsOptional()
  @IsDate()
  createdAt?: Date;

  @Expose()
  @IsOptional()
  @IsDate()
  updatedAt?: Date;
}
