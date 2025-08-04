import { Gift } from '../schema/gift.schema';

export interface IGiftService {
  getAllGifts(category?: string, isActive?: boolean): Promise<Gift[]>;
  getGift(giftId: string): Promise<Gift>;
  createGift(giftData: Partial<Gift>): Promise<Gift>;
  updateGift(giftId: string, updates: Partial<Gift>): Promise<Gift>;
  deleteGift(giftId: string): Promise<void>;
  getPopularGifts(limit?: number): Promise<Gift[]>;
  getGiftsByCategory(category: string): Promise<Gift[]>;
}
