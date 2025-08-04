import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyForgetOtpDto {
  @ApiProperty({
    description: 'Username or phone number used for password reset',
    example: 'john_doe or +1234567890',
  })
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'OTP received by the user',
    example: '1234',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;
}
