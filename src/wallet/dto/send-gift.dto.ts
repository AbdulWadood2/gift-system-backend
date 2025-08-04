import { Expose, Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { AppName } from '../../enum/appname.enum';

export class SendGiftDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  senderUserId: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  recipientUserId: string;

  @Expose()
  @IsEnum(AppName)
  @IsNotEmpty()
  appName: AppName;

  @Expose()
  @IsString()
  @IsNotEmpty()
  giftId: string;

  @Expose()
  @IsOptional()
  @IsString()
  postId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  message?: string;
}
