import { Expose, Transform } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { AppName } from '../../enum/appname.enum';

export class ChargeWalletDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  userId: string;

  @Expose()
  @IsEnum(AppName)
  @IsNotEmpty()
  appName: AppName;

  @Expose()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(1)
  amount: number;

  @Expose()
  @IsOptional()
  @IsString()
  paymentGateway?: string;

  @Expose()
  @IsOptional()
  @IsString()
  paymentTransactionId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;
}
