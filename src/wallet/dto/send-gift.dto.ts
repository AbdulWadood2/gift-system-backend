import { Expose, Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppName } from '../../enum/appname.enum';

export class SendGiftDto {
  @Expose()
  @ApiProperty({
    description: 'ID of the user sending the gift',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsNotEmpty()
  senderUserId: string;

  @Expose()
  @ApiProperty({
    description: 'ID of the user receiving the gift',
    example: '507f1f77bcf86cd799439012',
  })
  @IsString()
  @IsNotEmpty()
  recipientUserId: string;

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
    description: 'ID of the gift to send',
    example: '507f1f77bcf86cd799439013',
  })
  @IsString()
  @IsNotEmpty()
  giftId: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'ID of the post where the gift is being sent (optional)',
    example: '507f1f77bcf86cd799439014',
  })
  @IsOptional()
  @IsString()
  postId?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Optional message to accompany the gift',
    example: 'Happy Birthday! 🎉',
  })
  @IsOptional()
  @IsString()
  message?: string;
}
