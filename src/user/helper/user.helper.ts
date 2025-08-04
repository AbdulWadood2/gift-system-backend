import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../user/schema/user.schema';
import mongoose, { FilterQuery, Model } from 'mongoose';
import { IUserHelper } from '../interface/user.helper.interface';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto/user.dto';

@Injectable()
export class UserHelper implements IUserHelper {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Is User Exist
  async isUserExist(phoneNumber?: string, id?: string): Promise<User> {
    const query: any = {};

    if (phoneNumber) {
      query.phoneNumber = phoneNumber;
    }

    if (id) {
      query._id = id;
    }
    const user = await this.userModel.findOne({ ...query });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  // Remove Refresh Token
  async removeRefreshToken(_id: string, refreshToken: string): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: _id },
      { $pull: { refreshToken } },
      { new: true },
    );
    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }
    return updatedUser;
  }

  // Remove all refresh tokens (end all sessions)
  async removeAllRefreshTokens(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      userId,
      { $set: { refreshToken: [] } },
      { new: true },
    );
  }

  // Find User By Verification Token
  async findUserByVerificationToken(verificationToken: string): Promise<User> {
    const user = await this.userModel.findOne({
      verificationToken,
    });
    if (!user) {
      throw new BadRequestException('Verification token is invalid or expired');
    }
    return user;
  }

  // Update User
  async updateUser(userId: string, updates: Partial<User>): Promise<UserDto> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true }, // Return the updated document
    );
    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }
    return plainToInstance(UserDto, JSON.parse(JSON.stringify(updatedUser)), {
      excludeExtraneousValues: true,
    });
  }

  // find partial user and update partial
  async findAndUpdateUser(
    query: Partial<User>,
    updates: Partial<User>,
  ): Promise<UserDto> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      query as mongoose.FilterQuery<User>, // Cast the query to the appropriate type
      { $set: updates },
      {
        new: true, // Return the updated document
      },
    );
    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }
    return plainToInstance(UserDto, JSON.parse(JSON.stringify(updatedUser)), {
      excludeExtraneousValues: true,
    });
  }

  // Push Refresh Token
  async pushRefreshToken(_id: string, refreshToken: string): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id },
      { $push: { refreshToken } },
      { new: true },
    );
    const refreshedUser = updatedUser?.toObject();
    if (!refreshedUser) {
      throw new BadRequestException('User not found');
    }
    return refreshedUser;
  }

  // get user with users Partial<User>
  async getUserWithPartial(partial: Partial<User>): Promise<User> {
    // Ensure partial only contains valid query fields
    const filter: FilterQuery<User> = Object.keys(partial).reduce(
      (acc, key) => {
        const typedKey = key as keyof User;
        if (partial[typedKey] !== undefined) {
          acc[typedKey] = partial[typedKey];
        }
        return acc;
      },
      {} as FilterQuery<User>,
    );
    const user = (await this.userModel.findOne(filter))?.toObject();
    return user as User;
  }

  async getUserWithPartialNotError(partial: Partial<User>): Promise<User> {
    // Ensure partial only contains valid query fields
    const filter: FilterQuery<User> = Object.keys(partial).reduce(
      (acc, key) => {
        const typedKey = key as keyof User;
        if (partial[typedKey] !== undefined) {
          acc[typedKey] = partial[typedKey];
        }
        return acc;
      },
      {} as FilterQuery<User>,
    );

    const user = (await this.userModel.findOne(filter))?.toObject();
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  async findUserWithUserNameOrPhoneNumber(
    userNameOrPhoneNumber,
  ): Promise<User> {
    const user = await this.userModel.findOne({
      $or: [
        { userName: userNameOrPhoneNumber },
        { phoneNumber: userNameOrPhoneNumber },
      ],
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.toObject();
  }

  async findUserWithRefreshToken(refreshToken: string): Promise<User> {
    const user = await this.userModel.findOne({ refreshToken: refreshToken });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user.toObject();
  }

  async getUserByPhoneNumberOrUserName(
    phoneNumberOrUserName: string,
  ): Promise<UserDto> {
    const user = this.userModel.findOne({
      $or: [
        { phoneNumber: phoneNumberOrUserName },
        { userName: phoneNumberOrUserName },
      ],
    });
    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }
}
