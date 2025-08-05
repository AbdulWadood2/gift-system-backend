import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ResourceApp } from './schema/resource-app.schema';
import { ResourceAppDto } from './dto/resource-app.dto';
import { IResourceAppService } from './interface/resource-app.service.interface';
import {
  IResourceAppHelper,
  NotificationPayload,
} from './interface/resource-app.helper.interface';
import { logAndThrowError } from '../utils/error.utils';

@Injectable()
export class ResourceAppService implements IResourceAppService {
  constructor(
    @Inject('IResourceAppHelper')
    private readonly resourceAppHelper: IResourceAppHelper,
  ) {}

  async validateUser(appName: string, userId: string): Promise<any> {
    try {
      return await this.resourceAppHelper.validateUser(appName, userId);
    } catch (error) {
      throw logAndThrowError('error in validateUser', error);
    }
  }

  async sendNotification(
    appName: string,
    notificationPayload: NotificationPayload,
  ): Promise<void> {
    try {
      await this.resourceAppHelper.sendNotification(
        appName,
        notificationPayload,
      );
    } catch (error) {
      throw logAndThrowError('error in sendNotification', error);
    }
  }

  async createResourceApp(
    resourceAppData: Partial<ResourceApp>,
  ): Promise<ResourceAppDto> {
    try {
      if (!resourceAppData.appName) {
        throw new BadRequestException('appName is required');
      }
      const { appName, ...rest } = resourceAppData;
      const existingResourceApp =
        await this.resourceAppHelper.isResourceAppExistNotError(
          resourceAppData.appName,
        );
      if (existingResourceApp) {
        return await this.resourceAppHelper.updateResourceApp(appName, rest);
      } else {
        return await this.resourceAppHelper.createResourceApp(resourceAppData);
      }
    } catch (error) {
      throw logAndThrowError('error in createResourceApp', error);
    }
  }

  async updateResourceApp(
    appName: string,
    updates: Partial<ResourceApp>,
  ): Promise<ResourceAppDto> {
    try {
      return await this.resourceAppHelper.updateResourceApp(appName, updates);
    } catch (error) {
      throw logAndThrowError('error in updateResourceApp', error);
    }
  }

  async getAllResourceApps(): Promise<ResourceAppDto[]> {
    try {
      return await this.resourceAppHelper.getAllResourceApps();
    } catch (error) {
      throw logAndThrowError('error in getAllResourceApps', error);
    }
  }

  async deleteResourceApp(appName: string): Promise<boolean> {
    try {
      return await this.resourceAppHelper.deleteResourceApp(appName);
    } catch (error) {
      throw logAndThrowError('error in deleteResourceApp', error);
    }
  }
}
