import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ResourceAppService } from './resource-app.service';
import { ResourceApp } from './schema/resource-app.schema';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../enum/roles.enum';
import { IResourceAppService } from './interface/resource-app.service.interface';
import { NotificationPayload } from './interface/resource-app.helper.interface';
import { CreateUpdateResourceAppDto } from './dto/create-update-resource-app.dto';
import { ResourceAppDto } from './dto/resource-app.dto';

@ApiTags('Resource Apps')
@Controller('resource-apps')
export class ResourceAppController {
  constructor(
    @Inject('IResourceAppService')
    private readonly resourceAppService: IResourceAppService,
  ) {}

  // User-facing APIs
  @Get('validate-user/:appName/:userId')
  @ApiOperation({ summary: 'Validate user from external app' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiParam({ name: 'userId', description: 'User ID to validate' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User validation result',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request',
  })
  async validateUser(
    @Param('appName') appName: string,
    @Param('userId') userId: string,
  ): Promise<{ data: { isValid: boolean; user?: any } }> {
    const result = await this.resourceAppService.validateUser(appName, userId);
    return { data: result };
  }

  @Post('send-notification/:appName')
  @ApiOperation({ summary: 'Send notification to user via external app' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Notification sent successfully',
  })
  async sendNotification(
    @Param('appName') appName: string,
    @Body() notificationPayload: NotificationPayload,
  ): Promise<{ data: { success: boolean } }> {
    await this.resourceAppService.sendNotification(
      appName,
      notificationPayload,
    );
    return { data: { success: true } };
  }

  // Admin APIs
  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create resource app (Admin only)' })
  @ApiBody({ type: CreateUpdateResourceAppDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Resource app created successfully',
    type: ResourceAppDto,
  })
  async createResourceApp(
    @Body() resourceAppData: CreateUpdateResourceAppDto,
  ): Promise<{ data: ResourceAppDto }> {
    const result =
      await this.resourceAppService.createResourceApp(resourceAppData);
    return { data: result };
  }

  @Post(':appName')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update resource app (Admin only)' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiBody({ type: CreateUpdateResourceAppDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resource app updated successfully',
    type: ResourceAppDto,
  })
  async updateResourceApp(
    @Param('appName') appName: string,
    @Body() updates: CreateUpdateResourceAppDto,
  ): Promise<{ data: ResourceAppDto }> {
    const result = await this.resourceAppService.updateResourceApp(
      appName,
      updates,
    );
    return { data: result };
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all resource apps (Admin only)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resource apps retrieved successfully',
    type: [ResourceAppDto],
  })
  async getAllResourceApps(): Promise<{ data: ResourceAppDto[] }> {
    const result = await this.resourceAppService.getAllResourceApps();
    return { data: result };
  }

  @Post('delete/:appName')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete resource app (Admin only)' })
  @ApiParam({ name: 'appName', description: 'Application name' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resource app deleted successfully',
  })
  async deleteResourceApp(
    @Param('appName') appName: string,
  ): Promise<{ data: { success: boolean } }> {
    const success = await this.resourceAppService.deleteResourceApp(appName);
    return { data: { success } };
  }
}
