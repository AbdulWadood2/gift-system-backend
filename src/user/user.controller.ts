import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { IUserService } from './interface/user.service.interface';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { UserRole } from 'src/enum/roles.enum';
import { IBunnyHelper } from 'src/bunny/interface/bunny.helper.interface';
import { plainToInstance } from 'class-transformer';
import { UpdateProfileDto } from './dto/updateUser.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    @Inject('IUserService') private readonly userService: IUserService,
    @Inject('IBunnyHelper') private readonly bunnyHelper: IBunnyHelper,
  ) {}

  @ApiOperation({ summary: 'Update user profile' })
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch()
  async updateProfile(
    @Req() request: Request,
    @Body() dto: UpdateProfileDto,
  ): Promise<{ data: UserDto }> {
    const user: UserDto = request['fullUser'].toObject();
    const userId = request['fullUser']._id;
    if (userId.toString() !== user._id.toString()) {
      throw new BadRequestException('You can only update your own profile');
    }
    const updatedUser = await this.userService.updateProfile(userId, dto);
    return { data: updatedUser };
  }

  // get profile
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async getProfile(@Req() request: Request): Promise<{ data: UserDto }> {
    const user: UserDto = request['fullUser'].toObject();
    if (user.profileImage) {
      const signedUrl = await this.bunnyHelper.getSignedUrl(user.profileImage);
      if (signedUrl) {
        user.profileImage = signedUrl;
      }
    }
    return {
      data: plainToInstance(UserDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
