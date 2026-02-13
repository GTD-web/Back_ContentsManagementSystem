import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  ValidateNested,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateSurveyWithoutAnnouncementDto } from '../survey/create-survey.dto';
import { AttachmentDto } from '../common/attachment.dto';

/**
 * 공지사항 수정 DTO (JSON body)
 *
 * 파일 업로드는 Presigned URL 방식으로 전환되었습니다.
 * 프론트엔드에서 POST /admin/upload/presigned-url로 URL을 발급받아
 * S3에 직접 업로드 후, 파일 메타데이터를 attachments에 포함하여 전송합니다.
 */
export class UpdateAnnouncementDto {
  @ApiProperty({
    description:
      '공지사항 카테고리 ID (UUID) - 선택사항\n\n' +
      '공지사항이 속할 카테고리를 지정합니다.\n' +
      'GET /admin/announcements/categories 엔드포인트로 카테고리 목록을 조회할 수 있습니다.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiProperty({
    description: '공지사항 제목\n\n목록과 상세 페이지에 표시될 제목입니다.',
    example: '2024년 신년 인사',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description:
      '공지사항 내용\n\n' +
      '공지사항의 본문 내용입니다.\n' +
      'HTML 형식을 지원할 수 있습니다.',
    example: '새해 복 많이 받으세요. 2024년에도 최선을 다하겠습니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description:
      '상단 고정 여부\n\n' +
      '`true`이면 공지사항 목록 상단에 고정됩니다.\n' +
      '중요한 공지사항에 사용합니다.',
    example: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isFixed?: boolean;

  @ApiProperty({
    description:
      '공개 여부\n\n' +
      '- `true`: 전사공개 - 모든 직원에게 공개\n' +
      '- `false`: 제한공개 - 권한 설정에 따라 특정 직원/부서/직급/직책에만 공개',
    example: true,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({
    description:
      '공개 시작 일시 (ISO 8601 형식)\n\n' +
      '공지사항이 공개되기 시작하는 날짜와 시간입니다.\n' +
      '이 시간 이전에는 공지사항이 표시되지 않습니다.',
    example: '2024-01-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  releasedAt?: string;

  @ApiProperty({
    description:
      '공개 종료 일시 (ISO 8601 형식)\n\n' +
      '공지사항 공개가 종료되는 날짜와 시간입니다.\n' +
      '이 시간 이후에는 공지사항이 표시되지 않습니다.',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expiredAt?: string;

  @ApiProperty({
    description:
      '필독 여부\n\n' +
      '`true`이면 직원들이 반드시 읽어야 하는 공지사항으로 표시됩니다.\n' +
      '읽음 확인 기능과 연동될 수 있습니다.',
    example: false,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  mustRead?: boolean;

  @ApiProperty({
    description:
      '특정 직원 ID 목록 (SSO ID) - JSON 문자열\n\n' +
      '**제한공개 시 사용**\n\n' +
      '공지사항을 볼 수 있는 특정 직원들의 SSO ID 목록입니다.\n' +
      'JSON 문자열 형태로 전송: \'["employee-uuid-1", "employee-uuid-2"]\'\n' +
      '`isPublic=false`일 때만 적용됩니다.',
    example: '["employee-uuid-1", "employee-uuid-2"]',
    required: false,
  })
  @IsOptional()
  permissionEmployeeIds?: string | string[];

  @ApiProperty({
    description:
      '직급 ID 목록 (UUID) - JSON 문자열\n\n' +
      '**제한공개 시 사용**\n\n' +
      '공지사항을 볼 수 있는 직급의 UUID 목록입니다.\n' +
      'JSON 문자열 형태로 전송\n' +
      '`isPublic=false`일 때만 적용됩니다.',
    example: '["a1b2c3d4-e5f6-7890-abcd-ef1234567890"]',
    required: false,
  })
  @IsOptional()
  permissionRankIds?: string | string[];

  @ApiProperty({
    description:
      '직책 ID 목록 (UUID) - JSON 문자열\n\n' +
      '**제한공개 시 사용**\n\n' +
      '공지사항을 볼 수 있는 직책의 UUID 목록입니다.\n' +
      'JSON 문자열 형태로 전송\n' +
      '`isPublic=false`일 때만 적용됩니다.',
    example: '["c3d4e5f6-a7b8-9012-cdef-123456789012"]',
    required: false,
  })
  @IsOptional()
  permissionPositionIds?: string | string[];

  @ApiProperty({
    description:
      '부서 ID 목록 (UUID) - JSON 문자열\n\n' +
      '**제한공개 시 사용**\n\n' +
      '공지사항을 볼 수 있는 부서의 UUID 목록입니다.\n' +
      'JSON 문자열 형태로 전송\n' +
      '`isPublic=false`일 때만 적용됩니다.',
    example: '["e2b3b884-833c-4fdb-ba00-ede1a45b8160"]',
    required: false,
  })
  @IsOptional()
  permissionDepartmentIds?: string | string[];

  @ApiPropertyOptional({
    description:
      '첨부파일 목록 (S3 Presigned URL로 업로드 완료 후 전달)\n\n' +
      'POST /admin/upload/presigned-url API로 presigned URL을 먼저 발급받고,\n' +
      '프론트에서 S3에 직접 업로드한 뒤 반환된 fileUrl을 포함하여 전달합니다.\n\n' +
      '**파일 관리 방식:**\n' +
      '- `attachments`를 전송하면: 전송된 목록으로 교체\n' +
      '- `attachments`를 전송하지 않으면: 기존 첨부파일 유지 (변경 없음)\n' +
      '- 개별 파일 삭제는 별도 엔드포인트(`DELETE /:id/attachments`) 사용',
    type: [AttachmentDto],
    example: [
      {
        fileName: '수정된_공지사항.pdf',
        fileUrl: 'https://bucket.s3.ap-northeast-2.amazonaws.com/dev/announcements/uuid.pdf',
        fileSize: 2048000,
        mimeType: 'application/pdf',
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @ApiProperty({
    description:
      '정렬 순서\n\n' +
      '공지사항 목록에서의 표시 순서입니다.\n' +
      '숫자가 작을수록 먼저 표시됩니다.',
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? parseInt(value, 10) : undefined))
  @IsNumber()
  order?: number;

  @ApiProperty({
    description:
      '설문조사 정보 (수정 또는 생성) - JSON 문자열\n\n' +
      '공지사항에 연결할 설문조사 데이터입니다.\n' +
      'JSON 문자열 형태로 전송합니다.',
    example: '{"title":"만족도 조사","description":"의견을 들려주세요","questions":[]}',
    required: false,
  })
  @IsOptional()
  survey?: string | CreateSurveyWithoutAnnouncementDto;
}

/**
 * 공지사항 공개 상태 수정 DTO
 */
export class UpdateAnnouncementPublicDto {
  @ApiProperty({ description: '공개 여부', example: true })
  @IsBoolean()
  isPublic: boolean;
}

/**
 * 공지사항 고정 상태 수정 DTO
 */
export class UpdateAnnouncementFixedDto {
  @ApiProperty({ description: '고정 여부', example: true })
  @IsBoolean()
  isFixed: boolean;
}

/**
 * 공지사항 오더 수정 DTO
 */
export class UpdateAnnouncementOrderDto {
  @ApiProperty({ description: '정렬 순서', example: 1 })
  @IsNumber()
  order: number;
}

/**
 * 공지사항 카테고리 생성 DTO
 */
export class CreateAnnouncementCategoryDto {
  @ApiProperty({ description: '카테고리 이름', example: '인사' })
  @IsString()
  name: string;

  @ApiProperty({
    description: '카테고리 설명',
    example: '인사 관련 공지사항',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: '정렬 순서',
    example: 0,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  order?: number;
}

/**
 * 공지사항 카테고리 수정 DTO
 */
export class UpdateAnnouncementCategoryDto {
  @ApiProperty({ description: '카테고리 이름', example: '인사', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: '카테고리 설명',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: '활성화 여부', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

/**
 * 공지사항 카테고리 오더 수정 DTO
 */
export class UpdateAnnouncementCategoryOrderDto {
  @ApiProperty({ description: '정렬 순서', example: 1 })
  @IsNumber()
  order: number;
}
