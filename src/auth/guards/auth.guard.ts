import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IUserHelper } from 'src/user/interface/user.helper.interface';
import { logAndThrowError } from 'src/utils/error.utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('IUserHelper') private readonly userHelper: IUserHelper,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw logAndThrowError(
        '',
        new UnauthorizedException('Authorization token is missing'),
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const payloadUnique: string[] = [];
      const user = await this.userHelper.isUserExist(undefined, payload.userId);
      await Promise.all(
        user.refreshToken.map(async (refreshToken) => {
          try {
            const refreshTokenPayload = this.jwtService.verify(refreshToken, {
              secret: process.env.JWT_SECRET,
            });
            payloadUnique.push(refreshTokenPayload.uniqueId);
          } catch (error) {
            console.log('Error verifying refresh token:', error);
            await this.userHelper.removeRefreshToken(
              payload.userId,
              refreshToken,
            );
          }
        }),
      );
      if (!payloadUnique.includes(payload.uniqueId)) {
        throw logAndThrowError(
          '',
          new UnauthorizedException('Authorization token is invalid'),
        );
      }
      if (!user.isVerified) {
        throw new UnauthorizedException('User is not verified');
      }
      if (user.isBlocked) {
        throw new UnauthorizedException('User is blocked');
      }
      if (user.isSuspend) {
        throw new UnauthorizedException('User is suspended');
      }
      request['user'] = payload;
      request['fullUser'] = user;
    } catch (error) {
      console.log('Error in AuthGuard:', error);
      if (
        error instanceof UnauthorizedException &&
        error.message === 'User is not verified'
      ) {
        // Handle the "user not verified" case specifically
        logAndThrowError('User not verified', error);
      } else {
        // Handle other errors (e.g., invalid token)
        logAndThrowError(
          'Authorization token is invalid',
          new UnauthorizedException('Authorization token is invalid'),
        );
      }
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
