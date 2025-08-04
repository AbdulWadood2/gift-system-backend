import { Exclude, Expose, Transform } from 'class-transformer';
import { UserRole } from '../../enum/roles.enum';

export class UserDto {
  @Expose()
  @Transform(({ value }) => (value ? value.toString() : null)) // Ensures _id is always a string, safely
  _id: string;

  @Expose()
  profileImage: string;

  @Expose()
  name: string;

  @Expose()
  userName: string;

  @Exclude()
  password: string;

  @Expose()
  dateOfBirth: string;

  @Expose()
  nationality: string;

  @Expose()
  phoneNumber: string;

  @Exclude()
  verificationToken: string;

  @Expose()
  isVerified: boolean;

  @Expose()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return undefined;
    } else {
      return value;
    }
  }) // Ensures refreshToken is always a string
  refreshToken: string;

  @Expose()
  accessToken: string;

  @Expose()
  role: UserRole;

  @Expose()
  gender: number;
}
