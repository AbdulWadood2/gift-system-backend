import { User } from '../../user/schema/user.schema';
import { LogoutWithRefreshTokenDto } from '../dto/LogoutWithRefreshToken.dto';
import { RefreshTokenDto } from '../dto/refreshToken.dto';
import { UpdatePasswordDto } from '../dto/updatePassword.dto';

export interface IAuthHelper {
  encryptValue(password: string): string;
  decryptValue(encryptedPassword: string): string;
  validatePassword(plainPassword: string, storedPassword: string): boolean;
  generateTokens(
    userId: string,
    role: string,
    phoneNumber: string,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  decodeToken(token: string): Promise<{
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
  }>;
  refreshTokenExist(refreshToken: string, id: string): Promise<{ user: User }>;
  generateOtp(digits: number): number;
  generateStrongPassword(length: number): string;
  changePassword(dto: UpdatePasswordDto): Promise<void>;
  refreshToken(
    dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  logoutWithRefreshToken(dto: LogoutWithRefreshTokenDto): Promise<void>;
}
