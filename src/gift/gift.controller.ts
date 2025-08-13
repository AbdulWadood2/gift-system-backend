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
  ApiBody,
} from '@nestjs/swagger';
import { GiftService } from './gift.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../enum/roles.enum';
import { CreateGiftDto } from './dto/create-gift.dto';
import { UpdateGiftDto } from './dto/update-gift.dto';
import { GiftResponseDto } from './dto/gift-response.dto';
import {
  GetAllGiftsQueryDto,
  GetPopularGiftsQueryDto,
} from './dto/gift-query.dto';

@ApiTags('Gifts')
@Controller('gifts')
export class GiftController {
  constructor(
    @Inject('IGiftService')
    private readonly giftService: GiftService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all gifts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gifts retrieved successfully',
    type: [GiftResponseDto],
  })
  async getAllGifts(
    @Query() query: GetAllGiftsQueryDto,
  ): Promise<{ data: GiftResponseDto[] }> {
    const result = await this.giftService.getAllGifts(
      query.category,
      query.isActive,
    );
    return { data: result };
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular gifts' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Popular gifts retrieved successfully',
    type: [GiftResponseDto],
  })
  async getPopularGifts(
    @Query() query: GetPopularGiftsQueryDto,
  ): Promise<{ data: GiftResponseDto[] }> {
    const result = await this.giftService.getPopularGifts(query.limit);
    return { data: result };
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get gifts by category' })
  @ApiParam({ name: 'category', description: 'Gift category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gifts by category retrieved successfully',
    type: [GiftResponseDto],
  })
  async getGiftsByCategory(
    @Param('category') category: string,
  ): Promise<{ data: GiftResponseDto[] }> {
    const result = await this.giftService.getGiftsByCategory(category);
    return { data: result };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get gift by ID' })
  @ApiParam({ name: 'id', description: 'Gift ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gift retrieved successfully',
    type: GiftResponseDto,
  })
  async getGift(@Param('id') id: string): Promise<{ data: GiftResponseDto }> {
    const result = await this.giftService.getGift(id);
    return { data: result };
  }

  // Admin endpoints
  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new gift (Admin only)' })
  @ApiBody({ type: CreateGiftDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Gift created successfully',
    type: GiftResponseDto,
  })
  async createGift(
    @Body() giftData: CreateGiftDto,
  ): Promise<{ data: GiftResponseDto }> {
    const result = await this.giftService.createGift(giftData);
    return { data: result };
  }

  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update gift (Admin only)' })
  @ApiParam({ name: 'id', description: 'Gift ID' })
  @ApiBody({ type: UpdateGiftDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gift updated successfully',
    type: GiftResponseDto,
  })
  async updateGift(
    @Param('id') id: string,
    @Body() updates: UpdateGiftDto,
  ): Promise<{ data: GiftResponseDto }> {
    const result = await this.giftService.updateGift(id, updates);
    return { data: result };
  }

  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete gift (Admin only)' })
  @ApiParam({ name: 'id', description: 'Gift ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Gift deleted successfully',
  })
  async deleteGift(
    @Param('id') id: string,
  ): Promise<{ data: { success: boolean } }> {
    await this.giftService.deleteGift(id);
    return { data: { success: true } };
  }
}
