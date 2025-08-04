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
  verificationToken: string | null;

  @Prop({ type: [{ type: String }] })
  refreshToken: string[];

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.ADMIN,
  })
  role: UserRole;

  // Timestamps (automatically managed by Mongoose with timestamps: true)
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
