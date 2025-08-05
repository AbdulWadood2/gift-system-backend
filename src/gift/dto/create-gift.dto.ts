import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsObject,
  Min,
  IsUrl,
} from 'class-validator';

export class AnimationSettingsDto {
  @ApiProperty({
    description: 'Animation duration in seconds',
    example: 3.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  duration: number;

  @ApiProperty({
    description: 'Whether the animation should loop',
    example: true,
  })
  @IsBoolean()
  loop: boolean;

  @ApiProperty({
    description: 'Whether the animation should autoplay',
    example: true,
  })
  @IsBoolean()
  autoplay: boolean;
}

export class CreateGiftDto {
  @ApiProperty({
    description: 'Unique name identifier for the gift',
    example: 'rose_flower',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Display name shown to users',
    example: 'Rose Flower',
  })
  @IsString()
  displayName: string;

  @ApiProperty({
    description: 'Coin value required to send this gift',
    example: 100,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  coinValue: number;

  @ApiProperty({
    description: 'URL to the Lottie animation file',
    example: 'https://example.com/animations/rose.json',
  })
  @IsUrl()
  lottieUrl: string;

  @ApiPropertyOptional({
    description: 'URL to the gift thumbnail image',
    example: 'https://example.com/thumbnails/rose.png',
  })
  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: 'Description of the gift',
    example: 'A beautiful red rose flower animation',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Category of the gift',
    example: 'flowers',
    default: 'common',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Whether the gift is active and available',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this is a premium gift',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiPropertyOptional({
    description: 'Tags associated with the gift',
    example: ['flower', 'romantic', 'red'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Animation settings for the gift',
    type: AnimationSettingsDto,
  })
  @IsOptional()
  @IsObject()
  animationSettings?: AnimationSettingsDto;

  @ApiPropertyOptional({
    description: 'ID of the user who created this gift',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
} 