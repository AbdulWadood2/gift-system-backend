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

    const giftResponse = plainToInstance(GiftResponseDto, gift, {
      excludeExtraneousValues: true,
    });
    // Process file URLs for the gift
    return await this.processGiftFileUrls(giftResponse);
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

    // Process file URLs for all gifts
    const giftsResponse = plainToInstance(GiftResponseDto, gifts, {
      excludeExtraneousValues: true,
    });
    return await Promise.all(
      giftsResponse.map((gift) => this.processGiftFileUrls(gift)),
    );
  }

  async createGift(giftData: Partial<Gift>): Promise<GiftResponseDto> {
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
    const savedGift = await gift.save();
    const processedGift = plainToInstance(GiftResponseDto, savedGift, {
      excludeExtraneousValues: true,
    });
    return await this.processGiftFileUrls(processedGift);
  }

  async updateGift(
    giftId: string,
    updates: Partial<Gift>,
  ): Promise<GiftResponseDto> {
    const updatedGift = await this.giftModel.findByIdAndUpdate(
      giftId,
      { $set: updates },
      { new: true },
    );

    if (!updatedGift) {
      throw new BadRequestException('Gift not found');
    }

    const processedGift = plainToInstance(GiftResponseDto, updatedGift, {
      excludeExtraneousValues: true,
    });
    return await this.processGiftFileUrls(processedGift);
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

    const giftsResponse = plainToInstance(GiftResponseDto, gifts, {
      excludeExtraneousValues: true,
    });
    // Process file URLs for popular gifts
    return await Promise.all(
      giftsResponse.map((gift) => this.processGiftFileUrls(gift)),
    );
  }

  async getGiftsByCategory(category: string): Promise<GiftResponseDto[]> {
    const gifts = await this.giftModel
      .find({ category, isActive: true })
      .sort({ coinValue: 1 })
      .lean();

    const processedGifts = plainToInstance(GiftResponseDto, gifts, {
      excludeExtraneousValues: true,
    });
    // Process file URLs for category gifts
    return await Promise.all(
      processedGifts.map((gift) => this.processGiftFileUrls(gift)),
    );
  }

  // New method to process file URLs and validate file existence
  private async processGiftFileUrls(
    gift: GiftResponseDto,
  ): Promise<GiftResponseDto> {
    const processedGift: GiftResponseDto = { ...gift };

    // Process lottieUrl if it exists
    if (gift.lottieUrl) {
      // Extract file key from URL
      const fileKey = this.bunnyHelper.getKeyFromUrl(gift.lottieUrl);

      // Check if file exists
      const fileExists = await this.bunnyHelper.fileExists(fileKey);

      if (fileExists) {
        // Generate signed URL
        const signedUrl = await this.bunnyHelper.getSignedUrl(fileKey);
        if (signedUrl) {
          processedGift.lottieUrl = signedUrl;
        }
      }
    }

    // Process thumbnailUrl if it exists
    if (gift.thumbnailUrl) {
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
      }
    }

    return processedGift;
  }
}
