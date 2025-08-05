import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResourceApp } from '../schema/resource-app.schema';
import { ResourceAppDto } from '../dto/resource-app.dto';
import { Model } from 'mongoose';
import { plainToInstance } from 'class-transformer';
import {
  IResourceAppHelper,
  ExternalUserProfile,
  ExternalEligibilityResponse,
  NotificationPayload,
} from '../interface/resource-app.helper.interface';

@Injectable()
export class ResourceAppHelper implements IResourceAppHelper {
  constructor(
    @InjectModel(ResourceApp.name) private resourceAppModel: Model<ResourceApp>,
  ) {}

  // Get Resource App
  async getResourceApp(appName: string): Promise<ResourceAppDto> {
    const resourceApp = await this.isResourceAppExist(appName);
    return plainToInstance(ResourceAppDto, resourceApp, {
      excludeExtraneousValues: true,
    });
  }

  // Is Resource App Exist
  async isResourceAppExist(appName: string): Promise<ResourceAppDto> {
    const resourceApp = await this.resourceAppModel.findOne({ appName });
    if (!resourceApp) {
      throw new BadRequestException('Resource app not found');
    }
    return plainToInstance(ResourceAppDto, resourceApp, {
      excludeExtraneousValues: true,
    });
  }

  // Is Resource App Exist Not Error
  async isResourceAppExistNotError(
    appName: string,
  ): Promise<ResourceAppDto | null> {
    const resourceApp = await this.resourceAppModel.findOne({ appName });
    if (!resourceApp) return null;
    return plainToInstance(ResourceAppDto, resourceApp, {
      excludeExtraneousValues: true,
    });
  }

  // Validate User from External App
  async validateUser(
    appName: string,
    userId: string,
  ): Promise<ExternalUserProfile> {
    try {
      const resourceApp = await this.resourceAppModel.findOne({ appName });
      if (!resourceApp) {
        throw new BadRequestException('Resource app not found');
      }
      const userUrl = `${resourceApp.getUserProfileEndpoint}/${userId}`;

      const response = await fetch(userUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to validate user: ${response.statusText}`);
      }

      const responseData = await response.json();

      // Handle different response formats
      const userData = responseData?.data || responseData;
      if (!userData) {
        throw new Error('Invalid response format from external API');
      }

      return userData;
    } catch (error) {
      throw new Error(`Failed to validate user: ${error.message}`);
    }
  }

  // Check User Verification Status
  async checkUserVerification(
    appName: string,
    userId: string,
  ): Promise<ExternalEligibilityResponse> {
    try {
      const resourceApp = await this.resourceAppModel.findOne({ appName });
      if (!resourceApp) {
        throw new BadRequestException('Resource app not found');
      }
      const verificationUrl = `${resourceApp.getUserVerificationEndpoint}/${userId}`;

      const response = await fetch(verificationUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to check user verification: ${response.statusText}`,
        );
      }

      const responseData = await response.json();

      // Handle different response formats
      const eligibilityData = responseData?.data || responseData;
      if (!eligibilityData || typeof eligibilityData.isEligible !== 'boolean') {
        throw new Error(
          'Invalid response format from external API - missing isEligible field',
        );
      }

      return eligibilityData;
    } catch (error) {
      throw new Error(`Failed to check user verification: ${error.message}`);
    }
  }

  // Send Notification
  async sendNotification(
    appName: string,
    notificationPayload: NotificationPayload,
  ): Promise<void> {
    try {
      const resourceApp = await this.resourceAppModel.findOne({ appName });
      if (!resourceApp) {
        throw new BadRequestException('Resource app not found');
      }
      const notificationUrl = `${resourceApp.sendNotificationEndpoint}/${notificationPayload.userId}`;

      const response = await fetch(notificationUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: notificationPayload.title,
          message: notificationPayload.message,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.statusText}`);
      }
    } catch (error) {
      throw new Error(`Failed to send notification: ${error.message}`);
    }
  }

  // Create Resource App
  async createResourceApp(
    resourceAppData: Partial<ResourceApp>,
  ): Promise<ResourceAppDto> {
    const resourceApp = new this.resourceAppModel(resourceAppData);
    const savedResourceApp = await resourceApp.save();
    return plainToInstance(ResourceAppDto, savedResourceApp, {
      excludeExtraneousValues: true,
    });
  }

  // Update Resource App
  async updateResourceApp(
    appName: string,
    updates: Partial<ResourceApp>,
  ): Promise<ResourceAppDto> {
    const resourceApp = await this.resourceAppModel.findOneAndUpdate(
      { appName },
      updates,
      { new: true },
    );

    if (!resourceApp) {
      throw new Error(`Resource app not found for appName: ${appName}`);
    }

    return plainToInstance(ResourceAppDto, resourceApp, {
      excludeExtraneousValues: true,
    });
  }

  // Get All Resource Apps
  async getAllResourceApps(): Promise<ResourceAppDto[]> {
    const resourceApps = await this.resourceAppModel.find().exec();
    return plainToInstance(ResourceAppDto, resourceApps, {
      excludeExtraneousValues: true,
    });
  }

  // Delete Resource App
  async deleteResourceApp(appName: string): Promise<boolean> {
    const result = await this.resourceAppModel.deleteOne({ appName });
    return result.deletedCount > 0;
  }
}
