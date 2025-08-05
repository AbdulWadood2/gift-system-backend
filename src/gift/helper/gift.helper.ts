import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gift } from '../schema/gift.schema';
import { GiftResponseDto } from '../dto/gift-response.dto';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { IGiftHelper } from '../interface/gift.helper.interface';

@Injectable()
export class GiftHelper implements IGiftHelper {
  constructor(@InjectModel(Gift.name) private giftModel: Model<Gift>) {}

  async getGift(giftId: string): Promise<GiftResponseDto> {
    const gift = await this.giftModel.findById(giftId);
    if (!gift) {
      throw new BadRequestException('Gift not found');
    }
    return plainToInstance(GiftResponseDto, gift, {
      excludeExtraneousValues: true,
    });
  }

  async getAllGifts(category?: string, isActive?: boolean): Promise<GiftResponseDto[]> {
    const filter: any = {};

    if (category) {
      filter.category = category;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive;
    }

    const gifts = await this.giftModel
      .find(filter)
      .sort({ popularityScore: -1 })
      .lean();
    
    return plainToInstance(GiftResponseDto, gifts, {
      excludeExtraneousValues: true,
    });
  }

  async createGift(giftData: Partial<Gift>): Promise<GiftResponseDto> {
    try {
      const gift = new this.giftModel(giftData);
      const savedGift = await gift.save();
      return plainToInstance(GiftResponseDto, savedGift, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create gift');
    }
  }

  async updateGift(giftId: string, updates: Partial<Gift>): Promise<GiftResponseDto> {
    const updatedGift = await this.giftModel.findByIdAndUpdate(
      giftId,
      { $set: updates },
      { new: true },
    );

    if (!updatedGift) {
      throw new BadRequestException('Gift not found');
    }

    return plainToInstance(GiftResponseDto, updatedGift, {
      excludeExtraneousValues: true,
    });
  }

  async deleteGift(giftId: string): Promise<void> {
    const deletedGift = await this.giftModel.findByIdAndDelete(giftId);
    if (!deletedGift) {
      throw new BadRequestException('Gift not found');
    }
  }

  async incrementUsage(giftId: string): Promise<void> {
    await this.giftModel.findByIdAndUpdate(giftId, {
      $inc: { usageCount: 1 },
      $set: { lastUsedAt: new Date() },
    });
  }

  async getPopularGifts(limit: number = 10): Promise<GiftResponseDto[]> {
    const gifts = await this.giftModel
      .find({ isActive: true })
      .sort({ usageCount: -1, popularityScore: -1 })
      .limit(limit)
      .lean();
    
    return plainToInstance(GiftResponseDto, gifts, {
      excludeExtraneousValues: true,
    });
  }

  async getGiftsByCategory(category: string): Promise<GiftResponseDto[]> {
    const gifts = await this.giftModel
      .find({ category, isActive: true })
      .sort({ coinValue: 1 })
      .lean();
    
    return plainToInstance(GiftResponseDto, gifts, {
      excludeExtraneousValues: true,
    });
  }
}
