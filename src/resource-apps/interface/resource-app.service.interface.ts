import { ResourceApp } from '../schema/resource-app.schema';
import { NotificationPayload } from './resource-app.helper.interface';

export interface IResourceAppService {
  validateUser(appName: string, userId: string): Promise<any>;
  sendNotification(
    appName: string,
    notificationPayload: NotificationPayload,
  ): Promise<void>;
  createResourceApp(
    resourceAppData: Partial<ResourceApp>,
  ): Promise<ResourceApp>;
  updateResourceApp(
    appName: string,
    updates: Partial<ResourceApp>,
  ): Promise<ResourceApp>;
  getAllResourceApps(): Promise<ResourceApp[]>;
  deleteResourceApp(appName: string): Promise<boolean>;
}
