import { UserDto } from 'src/user/dto/user.dto';
import { LoginDto } from '../dto/login.dto';
import { SendVerifyOtpDto } from '../dto/sendVerifyOtp.dto';
import { OtpForVerify } from '../dto/OtpForVerify.dto';
import { RefreshTokenDto } from '../dto/refreshToken.dto';
import { LogoutWithRefreshTokenDto } from '../dto/LogoutWithRefreshToken.dto';
import { ForgetPasswordDto } from '../dto/forget-password.dto';
import { VerifyForgetOtpDto } from '../dto/verify-forget-otp.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AdminChangePasswordDto } from '../dto/updatePassword.dto';

export interface IAuthService {
  login(dto: LoginDto): Promise<UserDto>;
  refreshToken(
    dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }>;
  logoutWithRefreshToken(dto: LogoutWithRefreshTokenDto): Promise<void>;
  sendForgetPasswordOtp(dto: ForgetPasswordDto): Promise<string>;
  verifyForgetPasswordOtp(dto: VerifyForgetOtpDto): Promise<{ token: string }>;
  resetPassword(dto: ResetPasswordDto): Promise<string>;
}
