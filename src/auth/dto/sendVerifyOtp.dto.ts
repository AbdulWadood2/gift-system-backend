import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendVerifyOtpDto {
  @ApiPropertyOptional({
    type: String,
    description: 'user name of the user',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiPropertyOptional({
    type: String,
    description: 'phone number of the user',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiPropertyOptional({
    type: String,
    description: 'nationality of the user',
  })
  @IsNotEmpty()
  @IsString()
  nationality: string;
}
