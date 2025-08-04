import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  userId?: string;

  encryptPassword?: string;

  @ApiProperty({ description: 'Old password', example: 'oldpassword123' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ description: 'New password', example: 'newpassword456' })
  @IsString()
  newPassword: string;
}

export class AdminChangePasswordDto {
  @ApiProperty({ description: 'User ID', example: '507f191e810c19729de860eb' })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'New password', example: 'newpassword456' })
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
