import { Multer } from 'multer'; // ✅ Import Multer types correctly

export interface IBunnyHelper {
  uploadFile(
    file: Multer.File,
    storageUrlIs: string,
    userId: string,
  ): Promise<string>;
  deleteFile(fileName: string): Promise<string>;
  getSignedUrl(fileName: string): Promise<string | null>;
  getKeyFromUrl(fileUrl: string): string;
  fileExists(fileKey: string): Promise<boolean>;
}
