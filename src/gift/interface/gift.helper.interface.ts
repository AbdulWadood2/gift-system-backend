import { Gift } from '../schema/gift.schema';

export interface IGiftHelper {
  getGift(giftId: string): Promise<Gift>;
  getAllGifts(category?: string, isActive?: boolean): Promise<Gift[]>;
  createGift(giftData: Partial<Gift>): Promise<Gift>;
  updateGift(giftId: string, updates: Partial<Gift>): Promise<Gift>;
  deleteGift(giftId: string): Promise<void>;
  incrementUsage(giftId: string): Promise<void>;
  getPopularGifts(limit?: number): Promise<Gift[]>;
  getGiftsByCategory(category: string): Promise<Gift[]>;
}
