import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUser } from '@interface/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@interface/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@interface/common/guards';
import { AnnouncementBusinessService } from '@business/announcement-business/announcement-business.service';
import {
  AnnouncementResponseDto,
  AnnouncementListResponseDto,
} from '@interface/common/dto/announcement/announcement-response.dto';

@ApiTags('U-1. 사용자 - 공지사항')
@ApiBearerAuth('Bearer')
@UseGuards(JwtAuthGuard)
@Controller('user/announcements')
export class UserAnnouncementController {
  constructor(
    private readonly announcementBusinessService: AnnouncementBusinessService,
  ) {}

  /**
   * 공지사항 목록을 조회한다 (사용자용)
   */
  @Get()
  @ApiOperation({
    summary: '공지사항 목록 조회 (사용자용)',
    description:
      '사용자 권한에 따라 접근 가능한 공지사항 목록을 조회합니다. ' +
      '전사공개 또는 사용자가 속한 부서/직급/직책에 해당하는 공지사항만 조회됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '공지사항 목록 조회 성공',
    type: AnnouncementListResponseDto,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: '페이지 번호 (기본값: 1)',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '페이지당 개수 (기본값: 10)',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: '카테고리 ID 필터',
    type: String,
  })
  async 공지사항_목록을_조회한다(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoryId') categoryId?: string,
  ): Promise<AnnouncementListResponseDto> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;

    // TODO: 사용자 권한에 따른 필터링 로직 구현 필요
    // - 전사공개(isPublic: true) 공지사항
    // - 사용자의 부서/직급/직책이 포함된 제한공개 공지사항
    // - 사용자 ID가 permissionEmployeeIds에 포함된 공지사항

    const result =
      await this.announcementBusinessService.공지사항_목록을_조회한다({
        isPublic: true, // 임시: 전사공개만 조회
        page: pageNum,
        limit: limitNum,
        orderBy: 'order',
      });

    return {
      items: result.items,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: Math.ceil(result.total / result.limit),
    };
  }

  /**
   * 공지사항 상세를 조회한다 (사용자용)
   */
  @Get(':id')
  @ApiOperation({
    summary: '공지사항 상세 조회 (사용자용)',
    description:
      '특정 공지사항의 상세 정보를 조회합니다. ' +
      '사용자에게 접근 권한이 없는 경우 404를 반환합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '공지사항 조회 성공',
    type: AnnouncementResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '공지사항을 찾을 수 없거나 접근 권한이 없음',
  })
  async 공지사항_상세를_조회한다(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<AnnouncementResponseDto> {
    // TODO: 사용자 권한 확인 로직 구현 필요
    // - 전사공개가 아닌 경우, 사용자가 접근 권한이 있는지 확인

    const announcement =
      await this.announcementBusinessService.공지사항을_조회한다(id);

    return {
      ...announcement,
      survey: announcement.survey
        ? {
            id: announcement.survey.id,
            announcementId: announcement.survey.announcementId,
            title: announcement.survey.title,
            description: announcement.survey.description,
            startDate: announcement.survey.startDate,
            endDate: announcement.survey.endDate,
            order: announcement.survey.order,
            questions:
              announcement.survey.questions?.map((q) => ({
                id: q.id,
                title: q.title,
                type: q.type,
                form: q.form,
                isRequired: q.isRequired,
                order: q.order,
              })) || [],
            createdAt: announcement.survey.createdAt,
            updatedAt: announcement.survey.updatedAt,
          }
        : null,
    };
  }

  /**
   * 공지사항을 읽음 처리한다
   */
  @Post(':id/read')
  @ApiOperation({
    summary: '공지사항 읽음 처리',
    description: '공지사항을 읽음 상태로 처리합니다. 열람 기록을 남깁니다.',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '읽음 처리 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  async 공지사항을_읽음처리한다(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    // TODO: 공지사항 열람 기록 생성 로직 구현 필요
    // - AnnouncementView 테이블에 기록 저장
    // - 중복 열람 방지 로직 (같은 사용자가 이미 읽은 경우)

    return { success: true };
  }

  /**
   * 공지사항 설문에 응답한다
   */
  @Post(':id/survey/answers')
  @ApiOperation({
    summary: '공지사항 설문 응답 제출',
    description: '공지사항에 연결된 설문에 응답을 제출합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID',
    type: String,
  })
  @ApiResponse({
    status: 201,
    description: '설문 응답 제출 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 (설문이 없거나 이미 응답함)',
  })
  async 공지사항_설문에_응답한다(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() answers: any, // TODO: 응답 DTO 정의 필요
  ): Promise<{ success: boolean }> {
    // TODO: 설문 응답 제출 로직 구현 필요
    // - 설문 존재 여부 확인
    // - 중복 응답 확인
    // - 응답 유효성 검증
    // - 응답 저장

    return { success: true };
  }
}
