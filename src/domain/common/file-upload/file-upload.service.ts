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
        fileName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
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
   * 파일을 S3에 업로드하고 첨부파일 정보를 반환한다 (상세 경로 지정)
   * @param file 업로드할 파일
   * @param pathSegments 경로 세그먼트 배열 (예: ['공지사항명', '업로드파일들'])
   */
  async uploadFileWithPath(
    file: Express.Multer.File,
    pathSegments: string[],
  ): Promise<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }> {
    this.logger.log(`파일 업로드 시작 - 파일명: ${file.originalname}, 크기: ${file.size} bytes`);

    // 경로 세그먼트를 안전한 파일명으로 변환 (특수문자 제거)
    const sanitizedSegments = pathSegments.map((segment) =>
      this.sanitizePathSegment(segment),
    );

    // 원본 파일명도 안전하게 변환하고 타임스탬프 추가하여 고유성 보장
    const originalFileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const ext = originalFileName.split('.').pop();
    const nameWithoutExt = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
    const sanitizedFileName = this.sanitizePathSegment(nameWithoutExt);
    const timestamp = Date.now();
    const fileName = `${sanitizedFileName}_${timestamp}.${ext}`;

    // 최종 경로 생성
    const key = [...sanitizedSegments, fileName].join('/');

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
        fileName: originalFileName,
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
   * 경로 세그먼트를 안전한 파일명으로 변환
   * - 슬래시, 백슬래시 제거
   * - 특수문자를 언더스코어로 변환
   * - 공백을 언더스코어로 변환
   * - 연속된 언더스코어 제거
   */
  private sanitizePathSegment(segment: string): string {
    return segment
      .replace(/[\/\\]/g, '') // 슬래시, 백슬래시 제거
      .replace(/[<>:"|?*]/g, '_') // Windows 특수문자 변환
      .replace(/\s+/g, '_') // 공백을 언더스코어로
      .replace(/_+/g, '_') // 연속된 언더스코어를 하나로
      .replace(/^_|_$/g, '') // 앞뒤 언더스코어 제거
      .substring(0, 100); // 최대 100자로 제한
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

  /**
   * 여러 파일을 한 번에 업로드한다 (상세 경로 지정)
   */
  async uploadFilesWithPath(
    files: Express.Multer.File[],
    pathSegments: string[],
  ): Promise<Array<{
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
  }>> {
    this.logger.log(`${files.length}개 파일 일괄 업로드 시작 - 경로: ${pathSegments.join('/')}`);

    const uploadPromises = files.map((file) => this.uploadFileWithPath(file, pathSegments));
    const results = await Promise.all(uploadPromises);

    this.logger.log(`${results.length}개 파일 일괄 업로드 완료`);

    return results;
  }
}
