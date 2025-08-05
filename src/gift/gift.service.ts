import { Injectable, Inject } from '@nestjs/common';
import { IGiftService } from './interface/gift.service.interface';
import { IGiftHelper } from './interface/gift.helper.interface';
import { Gift } from './schema/gift.schema';
import { GiftResponseDto } from './dto/gift-response.dto';
import { logAndThrowError } from '../utils/error.utils';

@Injectable()
export class GiftService implements IGiftService {
  constructor(
    @Inject('IGiftHelper') private readonly giftHelper: IGiftHelper,
  ) {}

  async getAllGifts(
    category?: string,
    isActive?: boolean,
  ): Promise<GiftResponseDto[]> {
    try {
      return await this.giftHelper.getAllGifts(category, isActive);
    } catch (error) {
      throw logAndThrowError('error in getAllGifts', error);
    }
  }

  async getGift(giftId: string): Promise<GiftResponseDto> {
    try {
      return await this.giftHelper.getGift(giftId);
    } catch (error) {
      throw logAndThrowError('error in getGift', error);
    }
  }

  async createGift(giftData: Partial<Gift>): Promise<GiftResponseDto> {
    try {
      return await this.giftHelper.createGift(giftData);
    } catch (error) {
      throw logAndThrowError('error in createGift', error);
    }
  }

  async updateGift(giftId: string, updates: Partial<Gift>): Promise<GiftResponseDto> {
    try {
      return await this.giftHelper.updateGift(giftId, updates);
    } catch (error) {
      throw logAndThrowError('error in updateGift', error);
    }
  }

  async deleteGift(giftId: string): Promise<void> {
    try {
      await this.giftHelper.deleteGift(giftId);
    } catch (error) {
      throw logAndThrowError('error in deleteGift', error);
    }
  }

  async getPopularGifts(limit?: number): Promise<GiftResponseDto[]> {
    try {
      return await this.giftHelper.getPopularGifts(limit);
    } catch (error) {
      throw logAndThrowError('error in getPopularGifts', error);
    }
  }

  async getGiftsByCategory(category: string): Promise<GiftResponseDto[]> {
    try {
      return await this.giftHelper.getGiftsByCategory(category);
    } catch (error) {
      throw logAndThrowError('error in getGiftsByCategory', error);
    }
  }
}
