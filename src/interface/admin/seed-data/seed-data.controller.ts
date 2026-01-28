import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { SeedDataContextService } from '@context/seed-data-context/seed-data-context.service';
import {
  SeedDataConfigDto,
  SeedDataResultDto,
  GetSeedDataStatusDto,
} from '@interface/common/dto/seed-data';

/**
 * 시드 데이터 관리 컨트롤러
 * 개발 및 테스트를 위한 시드 데이터 생성/삭제/조회를 담당합니다.
 */
@ApiTags('A-0. 관리자 - 시드 데이터')
@ApiBearerAuth('Bearer')
@Controller('admin/seed')
export class SeedDataController {
  constructor(
    private readonly seedDataContextService: SeedDataContextService,
  ) {}

  /**
   * 시드 데이터를 생성한다
   */
  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '시드 데이터 생성',
    description:
      '개발 및 테스트용 시드 데이터를 생성합니다. Examples 드롭다운에서 원하는 시나리오를 선택하세요.',
  })
  @ApiBody({
    type: SeedDataConfigDto,
    examples: {
      basic: {
        summary: '📦 BASIC - 기본 시나리오 (권장)',
        description:
          '빠른 개발과 테스트를 위한 기본 데이터 세트\n\n' +
          '생성되는 데이터:\n' +
          '- 🌍 언어 4개 (한국어, 영어, 일본어, 중국어)\n' +
          '- 📢 공지사항 15개\n' +
          '  • 고정 공지 3개 (필독, 상단 고정)\n' +
          '  • 특정 직원 제한 3개 (SSO 직원 데이터 활용)\n' +
          '  • 특정 부서 제한 3개 (SSO 부서 데이터 활용)\n' +
          '  • 특정 직급 제한 3개 (SSO 직급 데이터 활용)\n' +
          '  • 특정 직책 제한 3개 (SSO 직책 데이터 활용)\n' +
          '  • 첨부파일 포함 다양한 패턴\n' +
          '- 📋 설문조사 3개 (공지사항 연동) + 응답 데이터\n' +
          '  • 만족도 조사 (선형 척도 + 체크박스)\n' +
          '  • 교육 프로그램 수요 조사 (객관식 + 체크박스)\n' +
          '  • 사내 식당 메뉴 개선 설문 (객관식 + 단답형)\n' +
          '  • 각 설문당 30~50% 직원 응답 (통계 조회 가능)\n' +
          '- 📁 공지사항 카테고리 3개\n' +
          '- 📰 뉴스 10개\n' +
          '- 📄 브로셔 5개 (다국어 × 4 = 20개 번역 자동 생성)\n\n' +
          '🔐 SSO 연동: 실제 조직 데이터(직원/부서/직급/직책)로 권한 설정\n' +
          '🌏 다국어 전략: 한국어 입력 시 나머지 3개 언어 자동 생성 (isSynced: true)\n\n' +
          '총 메인 엔티티: 38개 (설문조사 포함) | 번역: 20개\n' +
          '생성 시간: ~3초',
        value: {
          scenario: 'basic',
        },
      },
      full: {
        summary: '🎯 FULL - 전체 시나리오 (다국어 포함)',
        description:
          '전체 시스템 테스트를 위한 완전한 데이터 세트\n\n' +
          '✅ BASIC 시나리오 포함 +\n\n' +
          '📋 전자공시 10개 (다국어 × 4 = 40개 번역)\n\n' +
          '📊 IR 자료 10개 (다국어 × 4 = 40개 번역)\n\n' +
          '👥 주주총회 5개 (다국어 × 4 = 20개 번역) + 안건 10개\n\n' +
          '🔔 메인 팝업 3개 (다국어 × 4 = 12개 번역)\n\n' +
          '📖 루미르스토리 10개 (비다국어)\n\n' +
          '🎬 비디오갤러리 8개 (비다국어)\n\n' +
          '📚 Wiki 문서 10개 (폴더 3개 + 파일 7개)\n' +
          '  • "개발 가이드" 폴더: 전체 공개 (모든 직원 접근)\n' +
          '  • "인사 규정" 폴더: 특정 부서만 접근 (SSO 부서 데이터)\n' +
          '  • "프로젝트" 폴더: 특정 직급/직책만 접근 (SSO 조직 데이터)\n\n' +
          '🔐 SSO 연동: 실제 조직 데이터로 권한 설정\n' +
          '  - 공지사항: 직원/부서/직급/직책별 다양한 권한 패턴\n' +
          '  - Wiki 폴더: 부서/직급/직책 기반 접근 제어\n\n' +
          '🌏 다국어 전략: 한국어 입력 시 나머지 언어 자동 생성 (isSynced: true)\n' +
          '  - 전자공시, IR, 주주총회, 메인팝업, 브로셔 등\n\n' +
          '총 메인 엔티티: 66개 | 번역: 132개\n\n' +
          '생성 시간: ~15초',
        value: {
          scenario: 'full',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: '시드 데이터 생성 성공',
    type: SeedDataResultDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  async 시드_데이터를_생성한다(
    @Body() config: SeedDataConfigDto,
  ): Promise<SeedDataResultDto> {
    const startTime = Date.now();

    const results =
      await this.seedDataContextService.시드_데이터를_생성한다(config);

    const totalDuration = Date.now() - startTime;

    return {
      success: true,
      message: '시드 데이터가 성공적으로 생성되었습니다.',
      results,
      totalDuration,
    };
  }

  /**
   * 시드 데이터를 삭제한다
   */
  @Delete('clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '시드 데이터 삭제',
    description:
      '생성된 시드 데이터를 완전히 삭제합니다. 하드 삭제(hard delete)가 적용되어 데이터베이스에서 실제로 제거됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '시드 데이터 삭제 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: '시드 데이터가 성공적으로 삭제되었습니다.' },
      },
    },
  })
  async 시드_데이터를_삭제한다(): Promise<{ success: boolean; message: string }> {
    await this.seedDataContextService.시드_데이터를_삭제한다(true);

    return {
      success: true,
      message: '시드 데이터가 성공적으로 삭제되었습니다.',
    };
  }

  /**
   * 시드 데이터 상태를 조회한다
   */
  @Get('status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '시드 데이터 상태 조회',
    description: '현재 데이터베이스에 저장된 각 엔티티의 데이터 개수를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '시드 데이터 상태 조회 성공',
    type: GetSeedDataStatusDto,
  })
  async 시드_데이터_상태를_조회한다(): Promise<GetSeedDataStatusDto> {
    const status =
      await this.seedDataContextService.시드_데이터_상태를_조회한다();

    return status;
  }
}
