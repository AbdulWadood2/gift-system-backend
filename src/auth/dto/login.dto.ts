import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The user name of the user',
    example: 'Emma',
  })
  @IsNotEmpty({ message: 'userName is required' })
  userName: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
    minLength: 8,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
