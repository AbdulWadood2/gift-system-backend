import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty({
    description: 'Username or phone number for password reset',
    example: 'john_doe or +1234567890',
  })
  @IsNotEmpty()
  @IsString()
  identifier: string;
}
