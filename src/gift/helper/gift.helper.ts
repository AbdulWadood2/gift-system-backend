import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Gift } from '../schema/gift.schema';
import { GiftResponseDto } from '../dto/gift-response.dto';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import { IGiftHelper } from '../interface/gift.helper.interface';
import { IBunnyHelper } from '../../bunny/interface/bunny.helper.interface';

@Injectable()
export class GiftHelper implements IGiftHelper {
  constructor(
    @InjectModel(Gift.name) private giftModel: Model<Gift>,
    @Inject('IBunnyHelper') private readonly bunnyHelper: IBunnyHelper,
  ) {}

  async getGift(giftId: string): Promise<GiftResponseDto> {
    const gift = await this.giftModel.findById(giftId);
    if (!gift) {
      throw new BadRequestException('Gift not found');
    }
    
    // Process file URLs for the gift
    const processedGift = await this.processGiftFileUrls(gift);
    
    return plainToInstance(GiftResponseDto, processedGift, {
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
    
    // Process file URLs for all gifts
    const processedGifts = await Promise.all(
      gifts.map(gift => this.processGiftFileUrls(gift))
    );
    
    return plainToInstance(GiftResponseDto, processedGifts, {
      excludeExtraneousValues: true,
    });
  }

  async createGift(giftData: Partial<Gift>): Promise<GiftResponseDto> {
    try {
      // is file exists
      if (giftData.lottieUrl) {
        const fileKey = this.bunnyHelper.getKeyFromUrl(giftData.lottieUrl);
        const fileExists = await this.bunnyHelper.fileExists(fileKey);
        if (!fileExists) {
          throw new BadRequestException('Lottie file does not exist');
        }
      }
      if (giftData.thumbnailUrl) {
        const fileKey = this.bunnyHelper.getKeyFromUrl(giftData.thumbnailUrl);
        const fileExists = await this.bunnyHelper.fileExists(fileKey);
        if (!fileExists) {
          throw new BadRequestException('Thumbnail file does not exist');
        }
      }
      const gift = new this.giftModel(giftData);
      let savedGift = await gift.save();
      savedGift = await this.processGiftFileUrls(savedGift);
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
    
    // Process file URLs for popular gifts
    const processedGifts = await Promise.all(
      gifts.map(gift => this.processGiftFileUrls(gift))
    );
    
    return plainToInstance(GiftResponseDto, processedGifts, {
      excludeExtraneousValues: true,
    });
  }

  async getGiftsByCategory(category: string): Promise<GiftResponseDto[]> {
    const gifts = await this.giftModel
      .find({ category, isActive: true })
      .sort({ coinValue: 1 })
      .lean();
    
    // Process file URLs for category gifts
    const processedGifts = await Promise.all(
      gifts.map(gift => this.processGiftFileUrls(gift))
    );
    
    return plainToInstance(GiftResponseDto, processedGifts, {
      excludeExtraneousValues: true,
    });
  }

  // New method to process file URLs and validate file existence
  private async processGiftFileUrls(gift: any): Promise<any> {
    const processedGift = { ...gift };

    // Process lottieUrl if it exists
    if (gift.lottieUrl) {
      try {
        // Extract file key from URL
        const fileKey = this.bunnyHelper.getKeyFromUrl(gift.lottieUrl);
        
        // Check if file exists
        const fileExists = await this.bunnyHelper.fileExists(fileKey);
        
        if (fileExists) {
          // Generate signed URL
          const signedUrl = await this.bunnyHelper.getSignedUrl(fileKey);
          processedGift.lottieUrl = signedUrl;
          processedGift.lottieFileValid = true;
        } else {
          processedGift.lottieFileValid = false;
          processedGift.lottieUrl = null; // Set to null if file doesn't exist
        }
      } catch (error) {
        processedGift.lottieFileValid = false;
        processedGift.lottieUrl = null;
      }
    }

    // Process thumbnailUrl if it exists
    if (gift.thumbnailUrl) {
      try {
        // Extract file key from URL
        const fileKey = this.bunnyHelper.getKeyFromUrl(gift.thumbnailUrl);
        
        // Check if file exists
        const fileExists = await this.bunnyHelper.fileExists(fileKey);
        
        if (fileExists) {
          // Generate signed URL
          const signedUrl = await this.bunnyHelper.getSignedUrl(fileKey);
          processedGift.thumbnailUrl = signedUrl;
          processedGift.thumbnailFileValid = true;
        } else {
          processedGift.thumbnailFileValid = false;
          processedGift.thumbnailUrl = null; // Set to null if file doesn't exist
        }
      } catch (error) {
        processedGift.thumbnailFileValid = false;
        processedGift.thumbnailUrl = null;
      }
    }

    return processedGift;
  }
}
