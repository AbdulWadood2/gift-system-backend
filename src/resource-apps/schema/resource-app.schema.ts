import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AppName } from '../../enum/verification.enum';

@Schema({ timestamps: true })
export class ResourceApp extends Document {
  @Prop({
    type: String,
    enum: AppName,
    required: true,
    unique: true,
  })
  appName: AppName;

  @Prop({ type: String, required: true })
  getUserProfileEndpoint: string;

  @Prop({ type: String, required: true })
  getUserVerificationEndpoint: string;

  @Prop({ type: String, required: true })
  sendNotificationEndpoint: string;
}

export const ResourceAppSchema = SchemaFactory.createForClass(ResourceApp);
