import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class OtpForVerify {
  @ApiPropertyOptional({
    type: String, // Change type to String
    description: 'otp of the user',
  })
  @IsNotEmpty()
  @IsString() // Change to IsString
  @Length(4, 4, { message: 'otp must be a 4-digit number' })
  otp: string; // Change type to string

  @ApiPropertyOptional({
    type: String,
    description: 'phone number of the user',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
