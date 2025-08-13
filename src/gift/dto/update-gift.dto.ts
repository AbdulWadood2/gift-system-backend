import { ApiPropertyOptional } from '@nestjs/swagger';
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
import { AnimationSettingsDto } from './create-gift.dto';

export class UpdateGiftDto {
  @ApiPropertyOptional({
    description: 'Unique name identifier for the gift',
    example: 'rose_flower',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Display name shown to users',
    example: 'Rose Flower',
  })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({
    description: 'Coin value required to send this gift',
    example: 100,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  coinValue?: number;

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
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    description: 'Whether the gift is active and available',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Whether this is a premium gift',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @ApiPropertyOptional({
    description: 'Number of times this gift has been used',
    example: 150,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  usageCount?: number;

  @ApiPropertyOptional({
    description: 'Total revenue generated from this gift',
    example: 15000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalRevenue?: number;

  @ApiPropertyOptional({
    description: 'Popularity score of the gift',
    example: 85.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  popularityScore?: number;

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

  @ApiPropertyOptional({
    description: 'Last time this gift was used',
    example: '2024-01-15T10:30:00.000Z',
  })
  @IsOptional()
  lastUsedAt?: Date;
}
