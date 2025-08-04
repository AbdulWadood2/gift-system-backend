import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { GiftService } from './gift.service';
import { Gift } from './schema/gift.schema';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../enum/roles.enum';

@ApiTags('Gifts')
@Controller('gifts')
export class GiftController {
  constructor(
    @Inject('IGiftService')
    private readonly giftService: GiftService,
  ) {}

  @Get()
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all gifts' })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gifts retrieved successfully',
    type: [Gift],
  })
  async getAllGifts(
    @Query('category') category?: string,
    @Query('isActive') isActive?: boolean,
  ): Promise<Gift[]> {
    return this.giftService.getAllGifts(category, isActive);
  }

  @Get('popular')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get popular gifts' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Popular gifts retrieved successfully',
    type: [Gift],
  })
  async getPopularGifts(@Query('limit') limit?: number): Promise<Gift[]> {
    return this.giftService.getPopularGifts(limit);
  }

  @Get('category/:category')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get gifts by category' })
  @ApiParam({ name: 'category', description: 'Gift category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gifts by category retrieved successfully',
    type: [Gift],
  })
  async getGiftsByCategory(
    @Param('category') category: string,
  ): Promise<Gift[]> {
    return this.giftService.getGiftsByCategory(category);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get gift by ID' })
  @ApiParam({ name: 'id', description: 'Gift ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gift retrieved successfully',
    type: Gift,
  })
  async getGift(@Param('id') id: string): Promise<Gift> {
    return this.giftService.getGift(id);
  }

  @Post()
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new gift (Admin only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Gift created successfully',
    type: Gift,
  })
  async createGift(@Body() giftData: Partial<Gift>): Promise<Gift> {
    return this.giftService.createGift(giftData);
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update gift (Admin only)' })
  @ApiParam({ name: 'id', description: 'Gift ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gift updated successfully',
    type: Gift,
  })
  async updateGift(
    @Param('id') id: string,
    @Body() updates: Partial<Gift>,
  ): Promise<Gift> {
    return this.giftService.updateGift(id, updates);
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete gift (Admin only)' })
  @ApiParam({ name: 'id', description: 'Gift ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gift deleted successfully',
  })
  async deleteGift(@Param('id') id: string): Promise<void> {
    return this.giftService.deleteGift(id);
  }
}
