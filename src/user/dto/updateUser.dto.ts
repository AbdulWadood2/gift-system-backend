import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  Matches,
  IsOptional,
} from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({
    type: String,
    description: 'Profile image of the user',
  })
  @IsOptional()
  @IsString()
  profileImage?: string;

  @ApiPropertyOptional({ type: String, description: 'Name of the user' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String, description: 'Username of the user' })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Date of birth in YYYY-MM-DD format',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: 'Date of birth must be in YYYY-MM-DD format and valid',
  })
  dateOfBirth?: string;

  @ApiPropertyOptional({
    type: Number,
    description: '0 male, 1 female, 2 other',
  })
  @IsOptional()
  @IsNumber()
  gender?: number;
}
