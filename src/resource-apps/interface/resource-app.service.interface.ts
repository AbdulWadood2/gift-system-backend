import { ResourceApp } from '../schema/resource-app.schema';
import { ResourceAppDto } from '../dto/resource-app.dto';
import { NotificationPayload } from './resource-app.helper.interface';

export interface IResourceAppService {
  validateUser(appName: string, userId: string): Promise<any>;
  sendNotification(
    appName: string,
    notificationPayload: NotificationPayload,
  ): Promise<void>;
  createResourceApp(
    resourceAppData: Partial<ResourceApp>,
  ): Promise<ResourceAppDto>;
  updateResourceApp(
    appName: string,
    updates: Partial<ResourceApp>,
  ): Promise<ResourceAppDto>;
  getAllResourceApps(): Promise<ResourceAppDto[]>;
  deleteResourceApp(appName: string): Promise<boolean>;
}
