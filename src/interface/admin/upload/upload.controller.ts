import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { S3Service } from '@libs/storage/s3.service';
import {
  GeneratePresignedUrlDto,
  GeneratePresignedUrlResponseDto,
} from './dto/presigned-url.dto';

@ApiTags('A-11. 관리자 - 파일 업로드')
@ApiBearerAuth('Bearer')
@Controller('admin/upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  /**
   * Presigned URL을 생성한다
   *
   * 프론트엔드에서 이 URL을 사용하여 S3에 직접 파일을 업로드할 수 있습니다.
   * 업로드 완료 후 fileUrl을 사용하여 생성/수정 API에 전달합니다.
   */
  @Post('presigned-url')
  @ApiOperation({
    summary: 'S3 Presigned URL 생성',
    description:
      '파일을 S3에 직접 업로드하기 위한 Presigned PUT URL을 생성합니다.\n\n' +
      '**사용 방법:**\n' +
      '1. 이 API를 호출하여 presignedUrl과 fileUrl을 받습니다.\n' +
      '2. presignedUrl에 PUT 요청으로 파일을 직접 업로드합니다.\n' +
      '3. 업로드 성공 후, fileUrl을 사용하여 생성/수정 API에 전달합니다.\n\n' +
      '**프론트엔드 업로드 예시:**\n' +
      '```javascript\n' +
      'const response = await fetch(presignedUrl, {\n' +
      '  method: "PUT",\n' +
      '  body: file,\n' +
      '  headers: { "Content-Type": file.type }\n' +
      '});\n' +
      '```\n\n' +
      '**Presigned URL 만료 시간:** 10분',
  })
  @ApiResponse({
    status: 201,
    description: 'Presigned URL 생성 성공',
    type: GeneratePresignedUrlResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (파일 정보 누락)',
  })
  async presignedUrl을_생성한다(
    @Body() dto: GeneratePresignedUrlDto,
  ): Promise<GeneratePresignedUrlResponseDto> {
    const folder = dto.folder || 'uploads';

    const results = await this.s3Service.generatePresignedUrls(
      dto.files.map((f) => ({
        fileName: f.fileName,
        mimeType: f.mimeType,
      })),
      folder,
    );

    return {
      files: results,
    };
  }
}
