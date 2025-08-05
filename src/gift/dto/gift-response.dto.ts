import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AnimationSettingsResponseDto {
  @ApiPropertyOptional({
    description: 'Animation duration in seconds',
    example: 3.5,
  })
  duration?: number;

  @ApiPropertyOptional({
    description: 'Whether the animation should loop',
    example: true,
  })
  loop?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the animation should autoplay',
    example: true,
  })
  autoplay?: boolean;
}

export class GiftResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the gift',
    example: '507f1f77bcf86cd799439011',
  })
  _id: string;

  @ApiProperty({
    description: 'Unique name identifier for the gift',
    example: 'rose_flower',
  })
  name: string;

  @ApiProperty({
    description: 'Display name shown to users',
    example: 'Rose Flower',
  })
  displayName: string;

  @ApiProperty({
    description: 'Coin value required to send this gift',
    example: 100,
  })
  coinValue: number;

  @ApiProperty({
    description: 'URL to the Lottie animation file',
    example: 'https://example.com/animations/rose.json',
  })
  lottieUrl: string;

  @ApiPropertyOptional({
    description: 'URL to the gift thumbnail image',
    example: 'https://example.com/thumbnails/rose.png',
  })
  thumbnailUrl?: string;

  @ApiPropertyOptional({
    description: 'Description of the gift',
    example: 'A beautiful red rose flower animation',
  })
  description?: string;

  @ApiProperty({
    description: 'Category of the gift',
    example: 'flowers',
  })
  category: string;

  @ApiProperty({
    description: 'Whether the gift is active and available',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether this is a premium gift',
    example: false,
  })
  isPremium: boolean;

  @ApiProperty({
    description: 'Number of times this gift has been used',
    example: 150,
  })
  usageCount: number;

  @ApiProperty({
    description: 'Total revenue generated from this gift',
    example: 15000,
  })
  totalRevenue: number;

  @ApiProperty({
    description: 'Popularity score of the gift',
    example: 85.5,
  })
  popularityScore: number;

  @ApiProperty({
    description: 'Tags associated with the gift',
    example: ['flower', 'romantic', 'red'],
    type: [String],
  })
  tags: string[];

  @ApiPropertyOptional({
    description: 'Animation settings for the gift',
    type: AnimationSettingsResponseDto,
  })
  animationSettings?: AnimationSettingsResponseDto;

  @ApiPropertyOptional({
    description: 'ID of the user who created this gift',
    example: '507f1f77bcf86cd799439011',
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Last time this gift was used',
    example: '2024-01-15T10:30:00.000Z',
  })
  lastUsedAt?: Date;

  @ApiProperty({
    description: 'When the gift was created',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'When the gift was last updated',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
} 