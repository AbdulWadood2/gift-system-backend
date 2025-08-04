import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserDto } from './dto/user.dto';
import { IUserHelper } from './interface/user.helper.interface';
import { IUserService } from './interface/user.service.interface';
import { IBunnyHelper } from 'src/bunny/interface/bunny.helper.interface';
import { logAndThrowError } from 'src/utils/error.utils';
import { User } from './schema/user.schema';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserHelper') private readonly userHelper: IUserHelper,
    @Inject('IBunnyHelper') private readonly bunnyHelper: IBunnyHelper,
  ) {}

  // update profile
  async updateProfile(userId: string, dto: UserDto): Promise<UserDto> {
    try {
      if (dto.profileImage) {
        dto.profileImage = await this.bunnyHelper.getKeyFromUrl(
          dto.profileImage,
        );
      }
      // Check if user exists
      const user = await this.userHelper.getUserWithPartial({ _id: userId });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      if (user.userName !== dto.userName) {
        const userWithSameName = await this.userHelper.getUserWithPartial({
          userName: dto.userName,
        });
        if (userWithSameName) {
          throw new BadRequestException('User name already exist');
        }
      }
      // If profile image is being updated, validate its existence
      if (dto.profileImage) {
        const fileExist = await this.bunnyHelper.fileExists(dto.profileImage);
        if (!fileExist) {
          throw new BadRequestException('Profile image does not exist');
        }
      }
      // Update user details
      await this.userHelper.updateUser(userId, dto as unknown as User);
      if (dto.profileImage !== user.profileImage) {
        await this.bunnyHelper.deleteFile(user.profileImage);
      }
      // Fetch updated user to get limits
      const updatedUser = await this.userHelper.getUserWithPartial({
        _id: userId,
      });
      if (updatedUser.profileImage) {
        const signedUrl = await this.bunnyHelper.getSignedUrl(dto.profileImage);
        if (signedUrl) {
          updatedUser.profileImage = signedUrl;
        }
      }
      return plainToInstance(UserDto, updatedUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw logAndThrowError('error in updateProfile', error);
    }
  }
}
