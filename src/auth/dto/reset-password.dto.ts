import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Username or phone number for password reset',
    example: 'john_doe or +1234567890',
  })
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @ApiProperty({
    description: 'token',
    example:
      'U2FsdGVkX1+0daIpG416EwMc2VX0awmOB5DsZmgj37OYG5azYmxFYBX8R2N/o7XEs',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'One-Time Password sent to the user’s email',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty({ message: 'OTP is required' })
  otp: string;

  @ApiProperty({
    description: 'New password for the account',
    example: 'newStrongPassword123',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  newPassword: string;
}
