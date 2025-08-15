import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class AnimationSettingsResponseDto {
  @Expose()
  @ApiPropertyOptional({
    description: 'Animation duration in seconds',
    example: 3.5,
  })
  duration?: number;

  @Expose()
  @ApiPropertyOptional({
    description: 'Whether the animation should loop',
    example: true,
  })
  loop?: boolean;

  @Expose()
  @ApiPropertyOptional({
    description: 'Whether the animation should autoplay',
    example: true,
  })
  autoplay?: boolean;
}

export class GiftResponseDto {
  @Expose()
  @Type(() => String)
  @ApiProperty({
    description: 'Unique identifier for the gift',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @Expose()
  @ApiProperty({
    description: 'Unique name identifier for the gift',
    example: 'rose_flower',
  })
  name: string;

  @Expose()
  @ApiProperty({
    description: 'Display name shown to users',
    example: 'Rose Flower',
  })
  displayName: string;

  @Expose()
  @ApiProperty({
    description: 'Coin value required to send this gift',
    example: 100,
  })
  coinValue: number;

  @Expose()
  @ApiProperty({
    description: 'URL to the Lottie animation file',
    example: '/animations/rose.json',
  })
  lottieUrl: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'URL to the gift thumbnail image',
    example: '/thumbnails/rose.png',
  })
  thumbnailUrl?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Description of the gift',
    example: 'A beautiful red rose flower animation',
  })
  description?: string;

  @Expose()
  @ApiProperty({
    description: 'Category of the gift',
    example: 'flowers',
  })
  category: string;

  @Expose()
  @ApiProperty({
    description: 'Whether the gift is active and available',
    example: true,
  })
  isActive: boolean;

  @Expose()
  @ApiProperty({
    description: 'Whether this is a premium gift',
    example: false,
  })
  isPremium: boolean;

  @Expose()
  @ApiProperty({
    description: 'Number of times this gift has been used',
    example: 150,
  })
  usageCount: number;

  @Expose()
  @ApiProperty({
    description: 'Total revenue generated from this gift',
    example: 15000,
  })
  totalRevenue: number;

  @Expose()
  @ApiProperty({
    description: 'Popularity score of the gift',
    example: 85.5,
  })
  popularityScore: number;

  @Expose()
  @ApiProperty({
    description: 'Tags associated with the gift',
    example: ['flower', 'romantic', 'red'],
    type: [String],
  })
  tags: string[];

  @Expose()
  @ApiPropertyOptional({
    description: 'Animation settings for the gift',
    type: AnimationSettingsResponseDto,
  })
  animationSettings?: AnimationSettingsResponseDto;

  @Expose()
  @ApiPropertyOptional({
    description: 'ID of the user who created this gift',
    example: '507f1f77bcf86cd799439011',
  })
  createdBy?: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Last time this gift was used',
    example: '2024-01-15T10:30:00.000Z',
  })
  lastUsedAt?: Date;

  @Expose()
  @ApiProperty({
    description: 'When the gift was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @Expose()
  @ApiProperty({
    description: 'When the gift was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}
