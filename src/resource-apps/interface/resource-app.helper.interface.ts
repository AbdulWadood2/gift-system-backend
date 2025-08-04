import { ResourceApp } from '../schema/resource-app.schema';

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
  getResourceApp(appName: string): Promise<ResourceApp>;
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
  ): Promise<ResourceApp>;
  updateResourceApp(
    appName: string,
    updates: Partial<ResourceApp>,
  ): Promise<ResourceApp>;
  getAllResourceApps(): Promise<ResourceApp[]>;
  deleteResourceApp(appName: string): Promise<boolean>;
  isResourceAppExist(appName: string): Promise<ResourceApp>;
  isResourceAppExistNotError(appName: string): Promise<ResourceApp | null>;
}
