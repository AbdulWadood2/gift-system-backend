import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  TransactionType,
  TransactionStatus,
} from '../../wallet/schema/wallet.schema';
import { AppName } from '../../enum/appname.enum';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ type: String, required: true, index: true })
  transactionId: string;

  @Prop({ type: String, required: true, index: true })
  userId: string;

  @Prop({ type: String, enum: AppName, required: true, index: true })
  appName: AppName;

  @Prop({ type: String, enum: TransactionType, required: true })
  type: TransactionType;

  @Prop({
    type: String,
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: Number, required: true, min: 0 })
  balanceBefore: number;

  @Prop({ type: Number, required: true, min: 0 })
  balanceAfter: number;

  @Prop({ type: String, default: null })
  giftId: string;

  @Prop({ type: String, default: null })
  recipientUserId: string;

  @Prop({ type: String, default: null })
  senderUserId: string;

  @Prop({ type: String, default: null })
  postId: string;

  @Prop({ type: String, default: null })
  paymentGateway: string;

  @Prop({ type: String, default: null })
  paymentTransactionId: string;

  @Prop({ type: String, default: null })
  withdrawalRequestId: string;

  @Prop({ type: String, default: null })
  adminUserId: string;

  @Prop({ type: String, default: null })
  description: string;

  @Prop({ type: String, default: null })
  ipAddress: string;

  @Prop({ type: String, default: null })
  userAgent: string;

  @Prop({ type: Object, default: {} })
  metadata: Record<string, any>;

  @Prop({ type: String, default: null })
  errorMessage: string;

  @Prop({ type: Date, default: null })
  processedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Indexes for better query performance
TransactionSchema.index({ userId: 1, appName: 1, createdAt: -1 });
TransactionSchema.index({ transactionId: 1 }, { unique: true });
TransactionSchema.index({ type: 1, status: 1 });
TransactionSchema.index({ recipientUserId: 1, appName: 1 });
TransactionSchema.index({ senderUserId: 1, appName: 1 });
