import { Gift } from '../schema/gift.schema';
import { GiftResponseDto } from '../dto/gift-response.dto';

export interface IGiftService {
  getAllGifts(
    category?: string,
    isActive?: boolean,
  ): Promise<GiftResponseDto[]>;
  getGift(giftId: string): Promise<GiftResponseDto>;
  createGift(giftData: Partial<Gift>): Promise<GiftResponseDto>;
  updateGift(giftId: string, updates: Partial<Gift>): Promise<GiftResponseDto>;
  deleteGift(giftId: string): Promise<void>;
  getPopularGifts(limit?: number): Promise<GiftResponseDto[]>;
  getGiftsByCategory(category: string): Promise<GiftResponseDto[]>;
}
