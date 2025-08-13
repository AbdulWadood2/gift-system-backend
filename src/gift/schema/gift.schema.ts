import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Gift extends Document {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  displayName: string;

  @Prop({ type: Number, required: true, min: 1 })
  coinValue: number;

  @Prop({ type: String, default: null })
  thumbnailUrl: string;

  @Prop({ type: String, default: null })
  description: string;

  @Prop({ type: String, default: 'common' })
  category: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isPremium: boolean;

  @Prop({ type: Number, default: 0 })
  usageCount: number;

  @Prop({ type: Number, default: 0 })
  totalRevenue: number;

  @Prop({ type: Number, default: 0 })
  popularityScore: number;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: Object, default: {} })
  animationSettings: {
    duration: number;
    loop: boolean;
    autoplay: boolean;
  };

  @Prop({ type: String, default: null })
  createdBy: string;

  @Prop({ type: Date, default: null })
  lastUsedAt: Date;
}

export const GiftSchema = SchemaFactory.createForClass(Gift);

// Indexes for better query performance
GiftSchema.index({ isActive: 1, category: 1 });
GiftSchema.index({ coinValue: 1 });
GiftSchema.index({ popularityScore: -1 });
GiftSchema.index({ usageCount: -1 });
