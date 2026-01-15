import { ApiProperty } from '@nestjs/swagger';

/**
 * 시드 데이터 상태 조회 DTO
 */
export class GetSeedDataStatusDto {
  @ApiProperty({
    description: '언어 데이터 개수',
    example: 4,
  })
  languageCount: number;

  @ApiProperty({
    description: '공지사항 데이터 개수',
    example: 10,
  })
  announcementCount: number;

  @ApiProperty({
    description: '설문조사 데이터 개수',
    example: 3,
  })
  surveyCount: number;

  @ApiProperty({
    description: '뉴스 데이터 개수',
    example: 10,
  })
  newsCount: number;

  @ApiProperty({
    description: '브로셔 데이터 개수',
    example: 5,
  })
  brochureCount: number;

  @ApiProperty({
    description: '카테고리 데이터 개수',
    example: 5,
  })
  categoryCount: number;

  @ApiProperty({
    description: '전자공시 데이터 개수',
    example: 0,
  })
  electronicDisclosureCount: number;

  @ApiProperty({
    description: 'IR 데이터 개수',
    example: 0,
  })
  irCount: number;

  @ApiProperty({
    description: '주주총회 데이터 개수',
    example: 0,
  })
  shareholdersMeetingCount: number;

  @ApiProperty({
    description: '메인 팝업 데이터 개수',
    example: 0,
  })
  mainPopupCount: number;

  @ApiProperty({
    description: 'Lumir Story 데이터 개수',
    example: 0,
  })
  lumirStoryCount: number;

  @ApiProperty({
    description: '비디오 갤러리 데이터 개수',
    example: 0,
  })
  videoGalleryCount: number;

  @ApiProperty({
    description: '위키 데이터 개수',
    example: 0,
  })
  wikiCount: number;
}
