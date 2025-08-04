import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Multer } from 'multer'; // ✅ Import Multer types correctly
import { IBunnyHelper } from './interface/bunny.helper.interface';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { UserRole } from '../enum/roles.enum';

@ApiTags('Bunny Storage')
@Controller('bunny')
export class BunnyController {
  constructor(
    @Inject('IBunnyHelper') private readonly bunnyHelper: IBunnyHelper,
  ) {}

  @Post('upload')
  @ApiBearerAuth('JWT-auth') // Indicates Bearer Auth for Swagger UI
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Upload a file to Bunny.net' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        storageUrl: { type: 'string' },
        userId: { type: 'string' }, // Now optional, just remove 'required: false' (OpenAPI will treat as optional if not required)
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Multer.File,
    @Body() body: { storageUrl: string; userId?: string },
  ): Promise<{ data: string }> {
    const { storageUrl, userId } = body;
    if (!storageUrl) throw new Error('storageUrl is required');
    return {
      data: await this.bunnyHelper.uploadFile(
        file,
        storageUrl,
        userId as string,
      ),
    };
  }
}
