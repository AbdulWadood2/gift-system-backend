import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './interfaces/auth.service.interface';
import { IAuthHelper } from './interfaces/auth.helper.interface';
import { IUserHelper } from 'src/user/interface/user.helper.interface';
import { LoginDto } from './dto/login.dto';
import { plainToInstance } from 'class-transformer';
import { LogoutWithRefreshTokenDto } from './dto/LogoutWithRefreshToken.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { VerifyForgetOtpDto } from './dto/verify-forget-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { IBunnyHelper } from 'src/bunny/interface/bunny.helper.interface';
import { logAndThrowError } from 'src/utils/error.utils';
import { UserDto } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IAuthHelper') private readonly authHelper: IAuthHelper,
    @Inject('IUserHelper') private readonly userHelper: IUserHelper,
    @Inject('IBunnyHelper') private readonly bunnyHelper: IBunnyHelper,
  ) {}

  async login(dto: LoginDto): Promise<UserDto> {
    try {
      const user = await this.userHelper.findUserWithUserNameOrPhoneNumber(
        dto.userName,
      );
      if (!user) {
        throw new BadRequestException('User not found');
      }
      const { password, ...rest } = user;
      const userDto = plainToInstance(UserDto, rest);
      const decryptedPassword = this.authHelper.decryptValue(password);
      if (decryptedPassword != dto.password) {
        throw new BadRequestException('Invalid password');
      }
      const { accessToken, refreshToken } =
        await this.authHelper.generateTokens(
          userDto._id,
          userDto.role,
          userDto.phoneNumber,
        );
      userDto.accessToken = accessToken;
      userDto.refreshToken = refreshToken;
      await this.userHelper.pushRefreshToken(userDto._id, refreshToken);
      if (userDto.profileImage) {
        const signedUrl = await this.bunnyHelper.getSignedUrl(
          userDto.profileImage,
        );
        if (signedUrl) {
          userDto.profileImage = signedUrl;
        }
      }
      return plainToInstance(UserDto, userDto, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw logAndThrowError('error in login api', error);
    }
  }

  async refreshToken(
    dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      return await this.authHelper.refreshToken(dto);
    } catch (error) {
      throw logAndThrowError('error in refreshToken api', error);
    }
  }

  async logoutWithRefreshToken(dto: LogoutWithRefreshTokenDto): Promise<void> {
    try {
      await this.authHelper.logoutWithRefreshToken(dto);
    } catch (error) {
      throw logAndThrowError('error in logoutWithRefreshToken api', error);
    }
  }

  async sendForgetPasswordOtp(dto: ForgetPasswordDto): Promise<string> {
    try {
      const fourdigitcode = this.authHelper.generateOtp(4);
      const verifyToken = this.authHelper.encryptValue(
        fourdigitcode.toString(),
      );

      const user = await this.userHelper.findUserWithUserNameOrPhoneNumber(
        dto.identifier,
      );

      if (!user) {
        throw new BadRequestException('User not found');
      }

      await this.userHelper.findAndUpdateUser(
        { _id: user._id },
        { verificationToken: verifyToken },
      );

      return 'OTP sent for password reset';
    } catch (error) {
      throw logAndThrowError('error in sendForgetPasswordOtp api', error);
    }
  }

  async verifyForgetPasswordOtp(
    dto: VerifyForgetOtpDto,
  ): Promise<{ token: string }> {
    try {
      const user = await this.userHelper.findUserWithUserNameOrPhoneNumber(
        dto.identifier,
      );

      if (!user) {
        throw new BadRequestException('User not found');
      }
      if (!user.verificationToken) {
        throw new BadRequestException('OTP not sent');
      }

      // const otp = this.authHelper.decryptValue(user.verificationToken);
      // if (otp !== dto.otp) {
      //   throw new BadRequestException('Invalid OTP');
      // }
      const token = this.authHelper.encryptValue(user._id as string);
      return { token };
    } catch (error) {
      throw logAndThrowError('error in verifyForgetPasswordOtp api', error);
    }
  }

  async resetPassword(dto: ResetPasswordDto): Promise<string> {
    try {
      const user = await this.userHelper.findUserWithUserNameOrPhoneNumber(
        dto.identifier,
      );

      if (!user) {
        throw new BadRequestException('User not found');
      }
      if (!user.verificationToken) {
        throw new BadRequestException('OTP not sent');
      }
      const userUpdated = await this.userHelper.findAndUpdateUser(
        { _id: user._id },
        {
          password: this.authHelper.encryptValue(dto.newPassword),
          verificationToken: null,
        },
      );

      if (!userUpdated) {
        throw new BadRequestException('User not found');
      }

      return 'Password reset successfully';
    } catch (error) {
      throw logAndThrowError('error in resetPassword api', error);
    }
  }
}
