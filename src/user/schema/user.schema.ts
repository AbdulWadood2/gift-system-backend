import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../enum/roles.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, default: null })
  profileImage: string;

  @Prop({ type: String, default: null })
  name: string;

  @Prop({ type: String, default: null, unique: true })
  userName: string;

  @Prop({ type: String, default: null, unique: true })
  phoneNumber: string;

  @Prop({ type: String, default: null })
  password: string;

  @Prop({ type: String, default: null })
  dateOfBirth: string;

  @Prop({ type: Number, default: null, enum: [0, 1, 2] }) // 0 male , 1 female , 2 other
  gender: number;

  @Prop({ type: String, default: null })
  nationality: string;

  @Prop({ type: String, default: null })
  verificationToken: string | null;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: [{ type: String }] })
  refreshToken: string[];

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;

  @Prop({
    type: String,
    default: null,
    enum: [
      'English',
      'Arabic',
      'Hindi',
      'French',
      'Russian',
      'Urdu',
      'Italian',
      'Spanish',
      'German',
      'Mandarin',
      'Chinese',
      'Portuguese',
      'Dutch',
      'Turkish',
    ],
  })
  language: string;

  @Prop({ type: [String], default: [] })
  interests: string[];

  // add socketId array string
  @Prop({ type: [String], default: [] })
  socketId: string[];

  @Prop({ type: [String], default: [] })
  fcm_key: string[];

  @Prop({ type: Boolean, default: false })
  isBlocked: boolean;

  @Prop({ type: Boolean, default: false })
  isSuspend: boolean;

  @Prop({ type: Number, default: 0 })
  usedStorage: number; // in bytes

  @Prop({ type: Number, default: 0 })
  postsToday: number;

  @Prop({ type: Number, default: 0 })
  repliesToPost: number;

  @Prop({ type: Number, default: 0 })
  violationCount: number;

  @Prop({ type: Boolean, default: true })
  allowPrivateMessage: boolean;

  @Prop({ type: Boolean, default: false })
  isVoiceRecongnize: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
