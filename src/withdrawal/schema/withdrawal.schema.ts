import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { WithdrawalStatus } from '../../wallet/schema/wallet.schema';
import { AppName } from '../../enum/appname.enum';

@Schema({ timestamps: true })
export class Withdrawal extends Document {
  @Prop({ type: String, required: true, unique: true })
  withdrawalId: string;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: String, enum: AppName, required: true, index: true })
  appName: AppName;

  @Prop({ type: Number, required: true, min: 1 })
  coinAmount: number;

  @Prop({ type: Number, required: true, min: 0 })
  balanceBefore: number;

  @Prop({ type: Number, required: true, min: 0 })
  balanceAfter: number;

  @Prop({
    type: String,
    enum: WithdrawalStatus,
    default: WithdrawalStatus.PENDING,
  })
  status: WithdrawalStatus;

  @Prop({ type: String, default: null })
  adminUserId: string;

  @Prop({ type: Date, default: null })
  reviewedAt: Date;

  @Prop({ type: String, default: null })
  reviewNotes: string;

  @Prop({ type: String, default: null })
  rejectionReason: string;

  @Prop({ type: String, default: null })
  payoutMethod: string;

  @Prop({ type: String, default: null })
  payoutDetails: string;

  @Prop({ type: String, default: null })
  payoutTransactionId: string;

  @Prop({ type: Date, default: null })
  processedAt: Date;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String, default: null })
  verificationLevel: string;

  @Prop({ type: Number, default: 0 })
  totalGiftsReceived: number;

  @Prop({ type: Number, default: 0 })
  totalGiftsSent: number;

  @Prop({ type: Number, default: 0 })
  accountAge: number; // in days

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ type: String, default: null })
  ipAddress: string;

  @Prop({ type: String, default: null })
  userAgent: string;
}

export const WithdrawalSchema = SchemaFactory.createForClass(Withdrawal);

// Indexes for better query performance
WithdrawalSchema.index({ userId: 1, appName: 1, createdAt: -1 });
WithdrawalSchema.index({ withdrawalId: 1 }, { unique: true });
WithdrawalSchema.index({ status: 1, createdAt: -1 });
WithdrawalSchema.index({ adminUserId: 1, status: 1 });
WithdrawalSchema.index({ isVerified: 1, status: 1 });
