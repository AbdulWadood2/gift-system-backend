import { Exclude, Expose, Transform } from 'class-transformer';
import { AppName } from '../../enum/verification.enum';

export class ResourceAppDto {
  @Expose()
  @Transform(({ value }) => (value ? value.toString() : null))
  _id: string;

  @Expose()
  appName: AppName;

  @Expose()
  getUserProfileEndpoint: string;

  @Expose()
  sendNotificationEndpoint: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
