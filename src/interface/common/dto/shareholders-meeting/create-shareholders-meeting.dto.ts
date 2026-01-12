import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VoteResultType } from '@domain/core/shareholders-meeting/vote-result-type.types';

/**
 * 주주총회 첨부파일 DTO
 */
export class ShareholdersMeetingAttachmentDto {
  @ApiProperty({ description: '파일명', example: 'meeting_agenda.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: '파일 URL',
    example: 'https://s3.amazonaws.com/...',
  })
  @IsString()
  fileUrl: string;

  @ApiProperty({ description: '파일 크기 (bytes)', example: 1024000 })
  @IsNumber()
  fileSize: number;

  @ApiProperty({ description: 'MIME 타입', example: 'application/pdf' })
  @IsString()
  mimeType: string;
}

/**
 * 주주총회 번역 생성 DTO
 */
export class CreateShareholdersMeetingTranslationDto {
  @ApiProperty({
    description: '언어 ID',
    example: 'uuid-ko',
  })
  @IsString()
  languageId: string;

  @ApiProperty({
    description: '제목',
    example: '2024년 정기 주주총회',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '설명',
    example: '2024년 정기 주주총회입니다.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

/**
 * 의결 결과 번역 생성 DTO
 */
export class CreateVoteResultTranslationDto {
  @ApiProperty({
    description: '언어 ID',
    example: 'uuid-ko',
  })
  @IsString()
  languageId: string;

  @ApiProperty({
    description: '안건 제목',
    example: '제1호 의안: 재무제표 승인',
  })
  @IsString()
  title: string;
}

/**
 * 의결 결과(안건) 생성 DTO
 */
export class CreateVoteResultDto {
  @ApiProperty({
    description: '안건 번호',
    example: 1,
  })
  @IsNumber()
  agendaNumber: number;

  @ApiProperty({
    description: '전체 투표 수',
    example: 1000,
  })
  @IsNumber()
  totalVote: number;

  @ApiProperty({
    description: '찬성 투표 수',
    example: 950,
  })
  @IsNumber()
  yesVote: number;

  @ApiProperty({
    description: '반대 투표 수',
    example: 50,
  })
  @IsNumber()
  noVote: number;

  @ApiProperty({
    description: '찬성률 (%)',
    example: 95.0,
  })
  @IsNumber()
  approvalRating: number;

  @ApiProperty({
    description: '의결 결과',
    enum: VoteResultType,
    example: VoteResultType.ACCEPTED,
  })
  @IsEnum(VoteResultType)
  result: VoteResultType;

  @ApiProperty({
    description: '안건 번역 목록',
    type: [CreateVoteResultTranslationDto],
    example: [
      {
        languageId: 'uuid-ko',
        title: '제1호 의안: 재무제표 승인',
      },
      {
        languageId: 'uuid-en',
        title: 'Agenda 1: Approval of Financial Statements',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVoteResultTranslationDto)
  translations: CreateVoteResultTranslationDto[];
}

/**
 * 주주총회 생성 DTO
 */
export class CreateShareholdersMeetingDto {
  @ApiProperty({
    description: '번역 목록 (여러 언어 동시 설정 가능)',
    type: [CreateShareholdersMeetingTranslationDto],
    example: [
      {
        languageId: 'uuid-ko',
        title: '2024년 정기 주주총회',
        description: '2024년 정기 주주총회입니다.',
      },
      {
        languageId: 'uuid-en',
        title: '2024 Annual General Meeting',
        description: '2024 Annual General Meeting.',
      },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShareholdersMeetingTranslationDto)
  translations: CreateShareholdersMeetingTranslationDto[];

  @ApiProperty({
    description: '주주총회 장소',
    example: '서울특별시 강남구 테헤란로 123',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: '주주총회 일시',
    example: '2024-03-15T10:00:00.000Z',
  })
  @IsDateString()
  meetingDate: string;

  @ApiProperty({
    description: '의결 결과(안건) 목록',
    type: [CreateVoteResultDto],
    required: false,
    example: [
      {
        agendaNumber: 1,
        totalVote: 1000,
        yesVote: 950,
        noVote: 50,
        approvalRating: 95.0,
        result: 'accepted',
        translations: [
          {
            languageId: 'uuid-ko',
            title: '제1호 의안: 재무제표 승인',
          },
          {
            languageId: 'uuid-en',
            title: 'Agenda 1: Approval of Financial Statements',
          },
        ],
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVoteResultDto)
  voteResults?: CreateVoteResultDto[];

  @ApiProperty({ description: '생성자 ID', required: false })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
