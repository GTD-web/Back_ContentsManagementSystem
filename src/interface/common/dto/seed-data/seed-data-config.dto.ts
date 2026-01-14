import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

/**
 * 시드 데이터 시나리오 타입
 */
export enum SeedScenario {
  BASIC = 'basic', // 기본 시나리오
  FULL = 'full', // 전체 시나리오
}

/**
 * 시드 데이터 생성 설정 DTO
 */
export class SeedDataConfigDto {
  @ApiProperty({
    enum: ['basic', 'full'],
    enumName: 'SeedScenario',
    description: 
      '**시드 데이터 시나리오 선택**\n\n' +
      '### 📦 BASIC (기본 - 권장)\n' +
      '- 언어 4개 (한국어, 영어, 일본어, 중국어)\n' +
      '- 공지사항 15개 (고정 3개, 일반 12개)\n' +
      '- 공지사항 카테고리 3개\n' +
      '- 뉴스 10개\n' +
      '- 브로셔 5개\n' +
      '- 생성 시간: ~2초\n\n' +
      '### 🎯 FULL (전체)\n' +
      '- BASIC의 모든 데이터\n' +
      '- 전자공시 10개 + 카테고리 3개\n' +
      '- IR 자료 10개 + 카테고리 3개\n' +
      '- 주주총회 5개 + 카테고리 2개\n' +
      '- 메인 팝업 5개 + 카테고리 2개\n' +
      '- Lumir Story 10개\n' +
      '- 비디오 갤러리 8개\n' +
      '- 생성 시간: ~5초',
    example: 'basic',
  })
  @IsEnum(SeedScenario)
  scenario: SeedScenario;
}
