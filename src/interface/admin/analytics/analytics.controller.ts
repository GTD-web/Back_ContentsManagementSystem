import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnalyticsBusinessService } from '@business/analytics-business/analytics-business.service';
import { CreatePageViewDto } from '@interface/common/dto/analytics/create-page-view.dto';
import { UpdatePageViewDto } from '@interface/common/dto/analytics/update-page-view.dto';
import {
  PageViewResponseDto,
  AnalyticsDashboardDto,
} from '@interface/common/dto/analytics/page-view-response.dto';

@ApiTags('A-0. 관리자 - 분석')
@ApiBearerAuth('Bearer')
@Controller('admin/analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsBusinessService: AnalyticsBusinessService,
  ) {}

  /**
   * 페이지 조회를 생성한다 (방문 시작)
   */
  @Post('page-views')
  @ApiOperation({
    summary: '페이지 조회 생성',
    description:
      '사용자가 페이지에 방문할 때 호출하여 방문 기록을 생성합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '페이지 조회 생성 성공',
    type: PageViewResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  async 페이지_조회를_생성한다(
    @Body() createDto: CreatePageViewDto,
  ): Promise<PageViewResponseDto> {
    return await this.analyticsBusinessService.페이지_조회를_생성한다(
      createDto,
    );
  }

  /**
   * 페이지 조회를 수정한다 (방문 종료)
   */
  @Put('page-views/:id')
  @ApiOperation({
    summary: '페이지 조회 수정',
    description:
      '사용자가 페이지를 떠날 때 호출하여 체류 시간을 기록합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '페이지 조회 수정 성공',
    type: PageViewResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '페이지 조회를 찾을 수 없음',
  })
  async 페이지_조회를_수정한다(
    @Param('id') id: string,
    @Body() updateDto: UpdatePageViewDto,
  ): Promise<PageViewResponseDto> {
    // UUID 형식 검증
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('id는 유효한 UUID 형식이어야 합니다.');
    }

    return await this.analyticsBusinessService.페이지_조회를_수정한다(
      id,
      updateDto,
    );
  }

  /**
   * 분석 대시보드 데이터를 조회한다
   */
  @Get('dashboard')
  @ApiOperation({
    summary: '분석 대시보드 조회',
    description:
      '분석 대시보드에 필요한 모든 데이터를 조회합니다.\n\n' +
      '- 총 방문 기록 (30일)\n' +
      '- 총 방문자 수 (30일)\n' +
      '- 최근 방문 기록 (20개)\n' +
      '- 페이지별 방문수\n' +
      '- 시간대별 방문 현황',
  })
  @ApiResponse({
    status: 200,
    description: '분석 대시보드 조회 성공',
    type: AnalyticsDashboardDto,
  })
  async 분석_대시보드를_조회한다(): Promise<AnalyticsDashboardDto> {
    return await this.analyticsBusinessService.분석_대시보드_데이터를_조회한다();
  }
}
