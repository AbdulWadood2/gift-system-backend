import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { Multer } from 'multer'; // ✅ Import Multer types correctly
import { v4 as uuidv4 } from 'uuid';
import { IBunnyHelper } from '../interface/bunny.helper.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../user/schema/user.schema';

@Injectable()
export class BunnyHelper implements IBunnyHelper {
  private readonly apiKey = process.env.BUNNY_API_KEY;
  private readonly storageUrl = process.env.BUNNY_STORAGE_URL;
  private readonly cdnUrl = process.env.BUNNY_CDN_URL;

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // ✅ Upload File (Accepts Multer File)
  async uploadFile(
    file: Multer.File,
    storageUrlIs: string,
    userId?: string,
  ): Promise<string> {
    try {
      if (!file) {
        throw new InternalServerErrorException('No file uploaded');
      }
      const MAX_FILE_SIZE = 104857600;
      if (file.size > MAX_FILE_SIZE) {
        throw new InternalServerErrorException('File size exceeds 100MB limit');
      }
      const fileExtension = file.originalname.split('.').pop();
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;
      await axios.put(
        `${this.storageUrl}/${storageUrlIs}/${uniqueFileName}`,
        file.buffer,
        {
          headers: {
            AccessKey: this.apiKey,
            'Content-Type': file.mimetype,
          },
        },
      );

      // Update usedStorage for the user if userId is provided and not empty/null
      if (userId && userId.trim() !== '') {
        await this.userModel.findByIdAndUpdate(userId, {
          $inc: { usedStorage: file.size },
        });
      }
      const fileLocation = `${storageUrlIs}/${uniqueFileName}`;
      return fileLocation;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // ✅ Delete File
  async deleteFile(fileName: string): Promise<string> {
    try {
      await axios.delete(`${this.storageUrl}/${fileName}`, {
        headers: { AccessKey: this.apiKey },
      });
      return 'File deleted successfully';
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // File does not exist, treat as non-fatal
        console.warn(`[BunnyHelper] File not found for deletion: ${fileName}`);
        return 'File not found (already deleted)';
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  // ✅ Get Signed URL (Public URL with expiry)
  async getSignedUrl(fileName: string): Promise<string | null> {
    try {
      return fileName ? `${this.cdnUrl}/${fileName}` : null;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // ✅ Extract Key from URL
  getKeyFromUrl(fileUrl: string): string {
    try {
      return fileUrl.replace(`${this.cdnUrl}/`, '');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // ✅ Check if File Exists (Using Key)
  async fileExists(fileKey: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.storageUrl}/${fileKey}`, {
        headers: { AccessKey: this.apiKey },
      });

      return response.status === 200;
    } catch (error) {
      console.error(`Error checking file existence: ${error.message}`);
      return false; // File does not exist
    }
  }
}
