import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../user/schema/user.schema';
import * as CryptoJS from 'crypto-js';
import { JwtService } from '@nestjs/jwt';
import { IAuthHelper } from '../interfaces/auth.helper.interface';
import { v4 as uuidv4 } from 'uuid';
import { IUserHelper } from 'src/user/interface/user.helper.interface';
import { UserRole } from 'src/enum/roles.enum';
import { UpdatePasswordDto } from '../dto/updatePassword.dto';
import { RefreshTokenDto } from '../dto/refreshToken.dto';
import { LogoutWithRefreshTokenDto } from '../dto/LogoutWithRefreshToken.dto';

@Injectable()
export class AuthHelper implements IAuthHelper {
  constructor(
    @Inject('IUserHelper') private readonly userHelper: IUserHelper,
    private readonly jwtService: JwtService,
  ) {}
  private secretKey = process.env.ENCRYPTION_KEY;

  // Method to encrypt the password
  encryptValue(password: string): string {
    return CryptoJS.AES.encrypt(password, this.secretKey).toString();
  }

  // Method to decrypt the password
  decryptValue(encryptedPassword: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Method to validate password on login
  validatePassword(plainPassword: string, storedPassword: string): boolean {
    const decryptedPassword = this.decryptValue(storedPassword);
    return plainPassword === decryptedPassword;
  }

  // Generate Token
  async generateTokens(
    userId: string,
    role: UserRole,
    phoneNumber: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // generate otp
    const uniqueId = this.generateUniqueId();
    const accessToken = this.jwtService.sign(
      { userId, phoneNumber, role, uniqueId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_AccessTokenExpiry,
      },
    );
    const refreshToken = this.jwtService.sign(
      { userId, phoneNumber, role, uniqueId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_RefreshTokenExpiry,
      },
    );

    return { accessToken, refreshToken };
  }

  // Generate Unique Id
  generateUniqueId(namespace: string = 'default'): string {
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomString = uuidv4(); // Generate a UUID (Universally Unique Identifier)
    return `${namespace}-${timestamp}-${randomString}`;
  }

  // Decode Token
  async decodeToken(token: string): Promise<{
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
  }> {
    return this.jwtService.verify(token);
  }

  // Refresh Token Exist
  async refreshTokenExist(
    refreshToken: string,
    id: string,
  ): Promise<{ user: User }> {
    const user = await this.userHelper.isUserExist(undefined, id);
    if (!user || !user.refreshToken.includes(refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return { user };
  }

  // Generate OTP
  generateOtp(digits: number): number {
    if (digits <= 0) {
      throw new Error('Number of digits must be greater than 0');
    }
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(min + Math.random() * (max - min + 1));
  }

  // generate Strong Password
  generateStrongPassword(length: number): string {
    const possibleCharacters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += possibleCharacters.charAt(
        Math.floor(Math.random() * possibleCharacters.length),
      );
    }
    return password;
  }

  async changePassword(dto: UpdatePasswordDto): Promise<void> {
    // logic to change password
    const decryptedPassword = this.decryptValue(dto.encryptPassword as string);
    if (decryptedPassword !== dto.oldPassword) {
      throw new BadRequestException('Old password is incorrect');
    }
    // logic to change password
    await this.userHelper.findAndUpdateUser(
      {
        _id: dto.userId,
      },
      {
        password: this.encryptValue(dto.newPassword),
      },
    );
  }

  async refreshToken(
    dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userHelper.findUserWithRefreshToken(
      dto.refreshToken,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const { accessToken, refreshToken: refreshTokenIs } =
      await this.generateTokens(
        user._id as string,
        user.role,
        user.phoneNumber,
      );
    await this.userHelper.removeRefreshToken(
      user._id as string,
      dto.refreshToken,
    );
    await this.userHelper.pushRefreshToken(user._id as string, refreshTokenIs);
    return {
      accessToken,
      refreshToken: refreshTokenIs,
    };
  }

  async logoutWithRefreshToken(dto: LogoutWithRefreshTokenDto): Promise<void> {
    const user = await this.userHelper.findUserWithRefreshToken(
      dto.refreshToken,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.userHelper.removeRefreshToken(
      user._id as string,
      dto.refreshToken,
    );
  }
}
