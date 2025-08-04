import { UpdateProfileDto } from '../dto/updateUser.dto';
import { UserDto } from '../dto/user.dto';

export interface IUserService {
  updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserDto>;
}
