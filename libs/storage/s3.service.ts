import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { IStorageService, UploadedFile } from './interfaces/storage.interface';

/**
 * AWS S3 Storage Service
 * 
 * staging/production 환경에서 사용하는 AWS S3 저장소입니다.
 * NODE_ENV 환경 변수에 따라 파일 경로 앞에 환경별 prefix를 추가합니다.
 */
@Injectable()
export class S3Service implements IStorageService {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;
  private readonly envPrefix: string;

  constructor(private readonly configService: ConfigService) {
    this.region = this.configService.get<string>(
      'AWS_REGION',
      'ap-northeast-2',
    );
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET', '');
    
    // NODE_ENV에 따라 환경별 prefix 결정
    const env = this.configService.get<string>('NODE_ENV', 'development');
    this.envPrefix = this.getEnvPrefix(env);

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
          '',
        ),
      },
    });

    if (!this.bucketName) {
      this.logger.warn('AWS_S3_BUCKET이 설정되지 않았습니다.');
    }

    this.logger.log(`AWS S3 스토리지 초기화 - Bucket: ${this.bucketName}, Env: ${env}, Prefix: ${this.envPrefix}`);
  }

  /**
   * NODE_ENV 값에 따라 환경별 prefix를 반환합니다.
   */
  private getEnvPrefix(env: string): string {
    if (env === 'production' || env === 'prod') {
      return 'prod';
    }
    if (env === 'staging' || env === 'stage') {
      return 'stage';
    }
    // 기본값 (development, dev 등)
    return 'dev';
  }

  /**
   * 파일을 S3에 업로드합니다.
   * 모든 파일은 환경별 폴더(stage/prod) 안에 저장됩니다.
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<UploadedFile> {
    const fileExtension = file.originalname.split('.').pop();
    
    // 환경별 prefix를 경로 앞에 추가 (예: stage/lumir-stories/xxx.jpg)
    const filePath = `${this.envPrefix}/${folder}/${uuidv4()}.${fileExtension}`;

    const uploadParams: PutObjectCommandInput = {
      Bucket: this.bucketName,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read', // 공개 읽기 권한
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));

      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${filePath}`;

      this.logger.log(`파일 업로드 성공: ${file.originalname} → ${url}`);

      return {
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        url,
        order: 0, // 기본값, 호출자가 설정
      };
    } catch (error) {
      this.logger.error(`파일 업로드 실패: ${file.originalname}`, error);
      throw new Error(`파일 업로드에 실패했습니다: ${error.message}`);
    }
  }

  /**
   * 여러 파일을 S3에 업로드합니다.
   */
  async uploadFiles(
    files: Express.Multer.File[],
    folder: string = 'uploads',
  ): Promise<UploadedFile[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadFile(file, folder).then((uploaded) => ({
        ...uploaded,
        order: index,
      })),
    );

    return await Promise.all(uploadPromises);
  }

  /**
   * S3에서 파일을 삭제합니다.
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // URL에서 키 추출
      const url = new URL(fileUrl);
      const key = url.pathname.substring(1); // 맨 앞 '/' 제거

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );

      this.logger.log(`파일 삭제 성공: ${fileUrl}`);
    } catch (error) {
      this.logger.error(`파일 삭제 실패: ${fileUrl}`, error);
      throw new Error(`파일 삭제에 실패했습니다: ${error.message}`);
    }
  }

  /**
   * 여러 파일을 S3에서 삭제합니다.
   */
  async deleteFiles(fileUrls: string[]): Promise<void> {
    const deletePromises = fileUrls.map((url) => this.deleteFile(url));
    await Promise.all(deletePromises);
  }
}
