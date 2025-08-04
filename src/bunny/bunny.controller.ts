import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Multer } from 'multer'; // ✅ Import Multer types correctly
import { IBunnyHelper } from './interface/bunny.helper.interface';

@ApiTags('Bunny Storage')
@Controller('bunny')
export class BunnyController {
  constructor(
    @Inject('IBunnyHelper') private readonly bunnyHelper: IBunnyHelper,
  ) {}

  @Post('upload')
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
      data: await this.bunnyHelper.uploadFile(file, storageUrl, userId as string),
    };
  }
}
