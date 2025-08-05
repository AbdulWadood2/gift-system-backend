import { ResourceApp } from '../schema/resource-app.schema';
import { ResourceAppDto } from '../dto/resource-app.dto';

export interface ExternalUserProfile {
  _id: string;
  createdAt?: Date;
  [key: string]: any;
}

export interface ExternalEligibilityResponse {
  isEligible: boolean;
  [key: string]: any;
}

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
}

export interface IResourceAppHelper {
  getResourceApp(appName: string): Promise<ResourceAppDto>;
  validateUser(appName: string, userId: string): Promise<ExternalUserProfile>;
  checkUserVerification(
    appName: string,
    userId: string,
  ): Promise<ExternalEligibilityResponse>;
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
  isResourceAppExist(appName: string): Promise<ResourceAppDto>;
  isResourceAppExistNotError(appName: string): Promise<ResourceAppDto | null>;
}
