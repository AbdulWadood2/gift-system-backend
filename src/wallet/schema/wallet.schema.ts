import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AppName } from '../../enum/appname.enum';

export enum TransactionType {
  CHARGE = 'charge',
  SEND_GIFT = 'send_gift',
  RECEIVE_GIFT = 'receive_gift',
  WITHDRAW = 'withdraw',
  ADMIN_ADJUSTMENT = 'admin_adjustment',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum WithdrawalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PROCESSED = 'processed',
}

@Schema({ timestamps: true })
export class Wallet extends Document {
  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: String, enum: AppName, required: true, index: true })
  appName: AppName;

  @Prop({ type: Number, default: 0, min: 0 })
  balance: number;

  @Prop({ type: Number, default: 0, min: 0 })
  totalEarned: number;

  @Prop({ type: Number, default: 0, min: 0 })
  totalSpent: number;

  @Prop({ type: Number, default: 0, min: 0 })
  totalWithdrawn: number;

  @Prop({ type: Boolean, default: false })
  isFrozen: boolean;

  @Prop({ type: String, default: null })
  freezeReason: string;

  @Prop({ type: Date, default: null })
  lastTransactionAt: Date;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: String, default: null })
  verificationLevel: string;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);

// Compound index for userId and appName
WalletSchema.index({ userId: 1, appName: 1 }, { unique: true });
