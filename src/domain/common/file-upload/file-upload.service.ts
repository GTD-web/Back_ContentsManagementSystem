import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

/**
 * 파일 업로드 서비스
 *
 * S3에 파일을 업로드하고 URL을 반환합니다.
 */
@Injectable()
export class FileUploadService {
  private readonly logger = new Logger(FileUploadService.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>('AWS_REGION') || 'ap-northeast-2';
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') || '';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    });

    this.logger.log(`S3 클라이언트 초기화 완료 - Region: ${this.region}, Bucket: ${this.bucketName}`);
  }

  /**
   * 파일을 S3에 업로드하고 첨부파일 정보를 반환한다
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'announcements',
  ): Promise<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }> {
    this.logger.log(`파일 업로드 시작 - 파일명: ${file.originalname}, 크기: ${file.size} bytes`);

    // 고유한 파일명 생성 (UUID + 원본 확장자)
    const ext = file.originalname.split('.').pop();
    const key = `${folder}/${uuidv4()}.${ext}`;

    try {
      // S3에 업로드
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      // 파일 URL 생성
      const fileUrl = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

      this.logger.log(`파일 업로드 완료 - URL: ${fileUrl}`);

      return {
        fileName: file.originalname,
        fileUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
      };
    } catch (error) {
      this.logger.error(`파일 업로드 실패 - 파일명: ${file.originalname}`, error.stack);
      throw error;
    }
  }

  /**
   * 여러 파일을 한 번에 업로드한다
   */
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string = 'announcements',
  ): Promise<Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>> {
    this.logger.log(`${files.length}개 파일 일괄 업로드 시작`);

    const uploadPromises = files.map((file) => this.uploadFile(file, folder));
    const results = await Promise.all(uploadPromises);

    this.logger.log(`${results.length}개 파일 일괄 업로드 완료`);

    return results;
  }
}
