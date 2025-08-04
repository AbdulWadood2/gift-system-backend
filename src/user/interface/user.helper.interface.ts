import { User } from '../../user/schema/user.schema';
import { UserDto } from '../dto/user.dto';

export interface IUserHelper {
  isUserExist(phoneNumber?: string, id?: string): Promise<User>;
  removeRefreshToken(_id: string, refreshToken: string): Promise<User>;
  removeAllRefreshTokens(userId: string): Promise<void>;
  findUserByVerificationToken(verificationToken: string): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<UserDto>;
  findAndUpdateUser(
    query: Partial<User>,
    updates: Partial<User>,
  ): Promise<UserDto>;
  pushRefreshToken(_id: string, refreshToken: string): Promise<User>;
  getUserWithPartial(partial: Partial<User>): Promise<User>;
  getUserWithPartialNotError(partial: Partial<User>): Promise<User>;
  findUserWithUserNameOrPhoneNumber(userNameOrPhoneNumber): Promise<User>;
  findUserWithRefreshToken(refreshToken: string): Promise<User>;
  getUserByPhoneNumberOrUserName(
    phoneNumberOrUserName: string,
  ): Promise<UserDto>;
}
