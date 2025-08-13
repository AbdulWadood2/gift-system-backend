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

    const giftProcessed = plainToInstance(GiftResponseDto, gift.toObject(), {
      excludeExtraneousValues: true,
    });
    return await this.processGiftFileUrls(giftProcessed);
  }

  async getAllGifts(
    category?: string,
    isActive?: boolean,
  ): Promise<GiftResponseDto[]> {
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

    const giftsProcessed = plainToInstance(GiftResponseDto, gifts, {
      excludeExtraneousValues: true,
    });
    return await Promise.all(giftsProcessed.map((gift) => this.processGiftFileUrls(gift)));
  }

  async createGift(giftData: Partial<Gift>): Promise<GiftResponseDto> {
    // is file exists
    if (giftData.thumbnailUrl) {
      const fileKey = this.bunnyHelper.getKeyFromUrl(giftData.thumbnailUrl);
      giftData.thumbnailUrl = fileKey;
      const fileExists = await this.bunnyHelper.fileExists(
        giftData.thumbnailUrl,
      );
      if (!fileExists) {
        throw new BadRequestException('Thumbnail file does not exist');
      }
    }
    const gift = await this.giftModel.create(giftData);
    const giftProcessed = plainToInstance(GiftResponseDto, gift.toObject(), {
      excludeExtraneousValues: true,
    });
    return await this.processGiftFileUrls(giftProcessed);
  }

  async updateGift(
    giftId: string,
    updates: Partial<Gift>,
  ): Promise<GiftResponseDto> {
    let updatedGift = await this.giftModel.findByIdAndUpdate(
      giftId,
      { $set: updates },
      { new: true },
    );

    if (!updatedGift) {
      throw new BadRequestException('Gift not found');
    }
    const gift = plainToInstance(GiftResponseDto, updatedGift.toObject(), {
      excludeExtraneousValues: true,
    });
    const processedGift = await this.processGiftFileUrls(gift);
    return processedGift;
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
      gifts.map((gift) => this.processGiftFileUrls(gift.toObject())),
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
    const giftsProcessed = plainToInstance(GiftResponseDto, gifts, {
      excludeExtraneousValues: true,
    });
    return await Promise.all(giftsProcessed.map((gift) => this.processGiftFileUrls(gift)));
  }

  // New method to process file URLs and validate file existence
  private async processGiftFileUrls(
    gift: GiftResponseDto,
  ): Promise<GiftResponseDto> {
    const processedGift = gift;

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
          if (signedUrl) {
            processedGift.thumbnailUrl = signedUrl;
          }
        } else {
          processedGift.thumbnailUrl = null; // Set to null if file doesn't exist
        }
      } catch (error) {
        processedGift.thumbnailUrl = null;
      }
    }

    return processedGift;
  }
}
