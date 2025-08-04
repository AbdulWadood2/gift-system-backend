import { Inject, Injectable } from '@nestjs/common';
import { Gift } from './schema/gift.schema';
import { IGiftService } from './interface/gift.service.interface';
import { IGiftHelper } from './interface/gift.helper.interface';
import { logAndThrowError } from '../utils/error.utils';

@Injectable()
export class GiftService implements IGiftService {
  constructor(
    @Inject('IGiftHelper') private readonly giftHelper: IGiftHelper,
  ) {}

  async getAllGifts(category?: string, isActive?: boolean): Promise<Gift[]> {
    try {
      return await this.giftHelper.getAllGifts(category, isActive);
    } catch (error) {
      throw logAndThrowError('error in getAllGifts', error);
    }
  }

  async getGift(giftId: string): Promise<Gift> {
    try {
      return await this.giftHelper.getGift(giftId);
    } catch (error) {
      throw logAndThrowError('error in getGift', error);
    }
  }

  async createGift(giftData: Partial<Gift>): Promise<Gift> {
    try {
      return await this.giftHelper.createGift(giftData);
    } catch (error) {
      throw logAndThrowError('error in createGift', error);
    }
  }

  async updateGift(giftId: string, updates: Partial<Gift>): Promise<Gift> {
    try {
      return await this.giftHelper.updateGift(giftId, updates);
    } catch (error) {
      throw logAndThrowError('error in updateGift', error);
    }
  }

  async deleteGift(giftId: string): Promise<void> {
    try {
      return await this.giftHelper.deleteGift(giftId);
    } catch (error) {
      throw logAndThrowError('error in deleteGift', error);
    }
  }

  async getPopularGifts(limit?: number): Promise<Gift[]> {
    try {
      return await this.giftHelper.getPopularGifts(limit);
    } catch (error) {
      throw logAndThrowError('error in getPopularGifts', error);
    }
  }

  async getGiftsByCategory(category: string): Promise<Gift[]> {
    try {
      return await this.giftHelper.getGiftsByCategory(category);
    } catch (error) {
      throw logAndThrowError('error in getGiftsByCategory', error);
    }
  }
}
