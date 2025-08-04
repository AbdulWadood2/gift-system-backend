import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({
    description: 'The user name of the user',
    example: 'Emma',
  })
  userName: string;
}
