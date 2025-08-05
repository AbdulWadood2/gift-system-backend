import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppName } from '../../enum/verification.enum';

export class CreateUpdateResourceAppDto {
  @ApiProperty({
    description: 'Name of the app',
    enum: AppName,
    example: AppName.LEKLOK,
  })
  @IsNotEmpty()
  @IsEnum(AppName)
  appName: AppName;

  @ApiProperty({
    description: 'Endpoint to get user profile',
    example: 'https://api.example.com/user/profile',
  })
  @IsNotEmpty()
  @IsString()
  getUserProfileEndpoint: string;

  @ApiProperty({
    description: 'Endpoint to get user verification',
    example: 'https://api.example.com/user/verification',
  })
  @IsNotEmpty()
  @IsString()
  getUserVerificationEndpoint: string;

  @ApiProperty({
    description: 'Endpoint to send notifications',
    example: 'https://api.example.com/notifications/send',
  })
  @IsNotEmpty()
  @IsString()
  sendNotificationEndpoint: string;
}
