import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UseGuards,
  Get,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IAuthService } from './interfaces/auth.service.interface';
import { UserDto } from 'src/user/dto/user.dto';
import { LoginDto } from './dto/login.dto';
import { SendVerifyOtpDto } from './dto/sendVerifyOtp.dto';
import { OtpForVerify } from './dto/OtpForVerify.dto';
import { IAuthHelper } from './interfaces/auth.helper.interface';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorator/roles.decorator';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { LogoutWithRefreshTokenDto } from './dto/LogoutWithRefreshToken.dto';
import { RefreshTokenDto } from './dto/refreshToken.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { VerifyForgetOtpDto } from './dto/verify-forget-otp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserRole } from 'src/enum/roles.enum';

@ApiTags('Auth')
@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(
    @Inject('IAuthService') private readonly authService: IAuthService,
    @Inject('IAuthHelper') private readonly authHelper: IAuthHelper,
  ) {}

  @ApiOperation({ summary: 'login the user' })
  @Post('')
  async login(@Body() dto: LoginDto): Promise<{ data: UserDto }> {
    const user = await this.authService.login(dto);
    return {
      data: user,
    };
  }

  // change password by old passWord
  @ApiOperation({ summary: 'change password by old passWord' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post('/changePasswordByOldPassWord')
  async changePasswordByOldPassWord(
    @Body() dto: UpdatePasswordDto,
    @Req() request: Request,
  ): Promise<{ data: string }> {
    dto.userId = request['fullUser']._id.toString();
    dto.encryptPassword = request['fullUser'].password;

    await this.authHelper.changePassword(dto);
    return {
      data: `password changed successfully`,
    };
  }

  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @Post('/refresh-token')
  async refreshToken(
    @Body() dto: RefreshTokenDto,
  ): Promise<{ data: { accessToken: string; refreshToken: string } }> {
    const tokens = await this.authService.refreshToken(dto);
    return {
      data: tokens,
    };
  }

  @ApiOperation({ summary: 'Logout using refresh token' })
  @Post('/logout')
  async logoutWithRefreshToken(
    @Body() dto: LogoutWithRefreshTokenDto,
  ): Promise<{ data: string }> {
    await this.authService.logoutWithRefreshToken(dto);
    return {
      data: 'Logged out successfully',
    };
  }

  @ApiOperation({ summary: 'Send OTP for password reset' })
  @Post('/forget-password')
  async sendForgetPasswordOtp(
    @Body() dto: ForgetPasswordDto,
  ): Promise<{ data: string }> {
    const message = await this.authService.sendForgetPasswordOtp(dto);
    return {
      data: message,
    };
  }

  @ApiOperation({ summary: 'Verify OTP for password reset' })
  @Post('/verify-forget-otp')
  async verifyForgetPasswordOtp(
    @Body() dto: VerifyForgetOtpDto,
  ): Promise<{ data: { token: string } }> {
    const result = await this.authService.verifyForgetPasswordOtp(dto);
    return {
      data: result,
    };
  }

  @ApiOperation({ summary: 'Reset password after OTP verification' })
  @Post('/reset-password')
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ data: string }> {
    const message = await this.authService.resetPassword(dto);
    return {
      data: message,
    };
  }
}
