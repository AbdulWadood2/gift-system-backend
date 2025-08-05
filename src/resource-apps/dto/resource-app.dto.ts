import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AppName } from '../../enum/appname.enum';

export class ResourceAppDto {
  @Expose()
  @ApiProperty({
    description: 'Unique identifier for the resource app',
    example: '507f1f77bcf86cd799439011',
  })
  @Transform(({ value }) => (value ? value.toString() : null))
  _id: string;

  @Expose()
  @ApiProperty({
    description: 'Name of the app',
    enum: AppName,
    example: AppName.LEKLOK,
  })
  appName: AppName;

  @Expose()
  @ApiProperty({
    description: 'Endpoint to get user profile',
    example: 'https://api.example.com/user/profile',
  })
  getUserProfileEndpoint: string;

  @Expose()
  @ApiProperty({
    description: 'Endpoint to get user verification',
    example: 'https://api.example.com/user/verification',
  })
  getUserVerificationEndpoint: string;

  @Expose()
  @ApiProperty({
    description: 'Endpoint to send notifications',
    example: 'https://api.example.com/notifications/send',
  })
  sendNotificationEndpoint: string;

  @Expose()
  @ApiProperty({
    description: 'When the resource app was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'When the resource app was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
