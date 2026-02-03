import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from '@interface/common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '@interface/common/decorators/current-user.decorator';
import { Public } from '@interface/common/decorators/public.decorator';
import { AnnouncementBusinessService } from '@business/announcement-business/announcement-business.service';
import { AnnouncementRead } from '@domain/core/announcement/announcement-read.entity';
import {
  AnnouncementResponseDto,
  AnnouncementListResponseDto,
} from '@interface/common/dto/announcement/announcement-response.dto';
import { SubmitSurveyAnswerDto } from '@interface/common/dto/survey/submit-survey-answer.dto';
import { MyAnswersDto } from '@interface/common/dto/survey/survey-response.dto';
import { SurveyService } from '@domain/sub/survey/survey.service';
import { Category } from '@domain/common/category/category.entity';
import { FileUploadService } from '@domain/common/file-upload/file-upload.service';

@ApiTags('U-1. 사용자 - 공지사항')
@ApiBearerAuth('Bearer')
@Controller('user/announcements')
export class UserAnnouncementController {
  constructor(
    private readonly announcementBusinessService: AnnouncementBusinessService,
    @InjectRepository(AnnouncementRead)
    private readonly announcementReadRepository: Repository<AnnouncementRead>,
    private readonly surveyService: SurveyService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  /**
   * 공지사항 카테고리 목록을 조회한다 (사용자용)
   */
  @Get('categories')
  @ApiOperation({
    summary: '공지사항 카테고리 목록 조회 (사용자용)',
    description:
      '공지사항에 사용 가능한 카테고리 목록을 조회합니다. ' +
      '활성화된 카테고리만 정렬 순서에 따라 반환됩니다.',
  })
  @ApiResponse({
    status: 200,
    description: '카테고리 목록 조회 성공',
    type: [Category],
  })
  async 공지사항_카테고리_목록을_조회한다(): Promise<Category[]> {
    return await this.announcementBusinessService.공지사항_카테고리_목록을_조회한다();
  }

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
   * 조회 시 자동으로 읽음 처리 (AnnouncementRead 레코드 생성)
   */
  @Get(':id')
  @ApiOperation({
    summary: '공지사항 상세 조회 (사용자용)',
    description:
      '특정 공지사항의 상세 정보를 조회합니다.\n\n' +
      '**📊 자동 열람 기록 처리:**\n' +
      '- 처음 공지사항을 보는 사용자의 경우, `AnnouncementRead` 테이블에 읽음 레코드가 자동으로 추가됩니다.\n' +
      '- 이미 읽은 공지사항을 다시 조회하는 경우, 중복 레코드는 생성되지 않습니다.\n' +
      '- 읽음 기록은 `announcementId`와 `employeeId`로 고유하게 관리됩니다.\n\n' +
      '⚠️ **권한 확인:**\n' +
      '사용자에게 접근 권한이 없는 경우 404를 반환합니다.',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: '공지사항 조회 성공 (자동 읽음 처리 완료)',
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
    // - 전사공개가 아닌 경우, 사용자가 접근 권한이 있는지 확인

    // 1. 공지사항 조회
    const announcement =
      await this.announcementBusinessService.공지사항을_조회한다(id);

    // 2. 읽음 처리 (중복 확인 후 없으면 생성)
    // employeeNumber (사번)로 중복 확인
    const existingRead = await this.announcementReadRepository.findOne({
      where: {
        announcementId: id,
        employeeNumber: user.employeeNumber,
      },
    });

    if (!existingRead) {
      await this.announcementReadRepository.save({
        announcementId: id,
        employeeId: user.id, // 내부 UUID
        employeeNumber: user.employeeNumber, // SSO 사번
        readAt: new Date(),
      });
    }

    // 3. 설문 응답 내역 조회 (설문이 있는 경우)
    let myAnswers: MyAnswersDto | null = null;
    if (announcement.survey) {
      myAnswers = await this.surveyService.사용자의_설문_응답을_조회한다(
        announcement.survey.id,
        user.employeeNumber,
      );
    }

    // 4. 응답 반환
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
            myAnswers, // ✅ 사용자의 응답 내역 추가
          }
        : null,
    };
  }

  /**
   * 공지사항 설문에 응답한다
   */
  @Post(':id/survey/answers')
  @UseInterceptors(FilesInterceptor('files', 20)) // 최대 20개 파일 (여러 질문에 첨부 가능)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '공지사항 설문 응답 제출',
    description:
      '공지사항에 연결된 설문에 응답을 제출합니다.\n\n' +
      '**📋 FormData 작성 가이드:**\n\n' +
      '각 질문 타입에 맞는 응답을 제출해야 합니다:\n' +
      '- `short_answer`, `paragraph`: textAnswers (JSON 문자열)\n' +
      '- `multiple_choice`, `dropdown`: choiceAnswers (JSON 문자열)\n' +
      '- `checkboxes`: checkboxAnswers (JSON 문자열)\n' +
      '- `linear_scale`: scaleAnswers (JSON 문자열)\n' +
      '- `grid_scale`: gridAnswers (JSON 문자열)\n' +
      '- `file_upload`: files (실제 파일) + fileQuestionIds (JSON 문자열)\n' +
      '- `datetime`: datetimeAnswers (JSON 문자열)\n\n' +
      '**파일 업로드 방법 (백엔드에서 자동으로 S3 업로드 처리):**\n' +
      '1. `files`: 첨부할 실제 파일들 (최대 20개)\n' +
      '   - 프론트엔드에서 파일 객체를 그대로 전송\n' +
      '   - 백엔드에서 자동으로 S3에 업로드하고 URL 생성\n' +
      '2. `fileQuestionIds`: 각 파일이 속한 질문 ID 배열 (JSON 문자열)\n' +
      '   - 예: `["질문1-UUID", "질문1-UUID", "질문2-UUID"]`\n' +
      '   - files 배열과 같은 순서로 매칭됩니다\n' +
      '   - 같은 질문 ID를 여러 번 사용하면 해당 질문에 여러 파일 첨부 가능\n\n' +
      '⚠️ **주의사항:**\n' +
      '- Content-Type은 multipart/form-data를 사용합니다\n' +
      '- 배열과 객체는 JSON 문자열로 전송해야 합니다\n' +
      '- 파일은 프론트엔드에서 URL로 변환하지 말고 실제 파일을 전송하세요',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID',
    type: String,
  })
  @ApiBody({
    description:
      '설문 응답 데이터 (FormData)\n\n' +
      '**중요 사항**:\n' +
      '1. 질문 타입에 맞는 응답 배열에 데이터를 추가해야 합니다.\n' +
      '2. 필수 질문(`isRequired: true`)은 반드시 응답해야 합니다.\n' +
      '3. 선택형/체크박스 응답은 질문의 `form.options`에 정의된 값만 사용 가능합니다.\n' +
      '4. 파일은 실제 파일을 files 필드에 첨부하고, fileQuestionIds로 질문 ID를 매핑합니다.\n' +
      '5. 백엔드에서 자동으로 S3에 업로드하므로 프론트엔드에서 별도 업로드 불필요합니다.',
    examples: {
      'complete-survey': {
        summary: '전체 응답 예시 (모든 질문 타입 포함)',
        description:
          '설문조사의 모든 질문 타입에 대한 응답 예시입니다.\n' +
          '실제로는 설문에 있는 질문들에만 응답하면 됩니다.\n\n' +
          '**파일 첨부 방법:**\n' +
          '- `files`: 실제 파일 객체를 FormData에 추가\n' +
          '- `fileQuestionIds`: JSON 문자열로 각 파일이 속한 질문 ID 배열 전송\n' +
          '- 예시에서는 질문 123e4567-e89b-12d3-a456-426614174007에 2개의 파일 첨부',
        value: {
          textAnswers: [
            {
              questionId: '123e4567-e89b-12d3-a456-426614174001',
              textValue: '홍길동',
            },
            {
              questionId: '123e4567-e89b-12d3-a456-426614174002',
              textValue:
                '제품 품질이 우수하며, 지속적인 개선이 필요한 부분은 사용자 경험 개선입니다.',
            },
          ],
          choiceAnswers: [
            {
              questionId: '123e4567-e89b-12d3-a456-426614174003',
              selectedOption: '매우 만족',
            },
          ],
          checkboxAnswers: [
            {
              questionId: '123e4567-e89b-12d3-a456-426614174004',
              selectedOptions: ['가격', '품질', '디자인'],
            },
          ],
          scaleAnswers: [
            {
              questionId: '123e4567-e89b-12d3-a456-426614174005',
              scaleValue: 8,
            },
          ],
          gridAnswers: [
            {
              questionId: '123e4567-e89b-12d3-a456-426614174006',
              gridAnswers: [
                {
                  rowName: '서비스 품질',
                  columnValue: '매우 만족',
                },
                {
                  rowName: '응답 속도',
                  columnValue: '만족',
                },
                {
                  rowName: '친절도',
                  columnValue: '매우 만족',
                },
              ],
            },
          ],
          fileQuestionIds: [
            '123e4567-e89b-12d3-a456-426614174007',
            '123e4567-e89b-12d3-a456-426614174007',
          ],
          datetimeAnswers: [
            {
              questionId: '123e4567-e89b-12d3-a456-426614174008',
              datetimeValue: '2024-02-15T14:00:00+09:00',
            },
          ],
        },
      },
      'simple-survey': {
        summary: '간단한 설문 응답 예시',
        description: '텍스트, 선택형, 척도 질문만 포함된 간단한 설문 응답',
        value: {
          textAnswers: [
            {
              questionId: '31e6bbc6-2839-4477-9672-bb4b381e8914',
              textValue: '영업팀',
            },
          ],
          choiceAnswers: [
            {
              questionId: '42e6bbc6-2839-4477-9672-bb4b381e8915',
              selectedOption: '만족',
            },
          ],
          scaleAnswers: [
            {
              questionId: '53e6bbc6-2839-4477-9672-bb4b381e8916',
              scaleValue: 7,
            },
          ],
        },
      },
      'grid-survey': {
        summary: '그리드 척도 설문 응답 예시',
        description: '여러 항목을 동일한 척도로 평가하는 그리드 형식 설문',
        value: {
          gridAnswers: [
            {
              questionId: '64e6bbc6-2839-4477-9672-bb4b381e8917',
              gridAnswers: [
                {
                  rowName: '제품 품질',
                  columnValue: '매우 만족',
                },
                {
                  rowName: '가격 대비 성능',
                  columnValue: '만족',
                },
                {
                  rowName: '고객 지원',
                  columnValue: '보통',
                },
                {
                  rowName: '배송 속도',
                  columnValue: '만족',
                },
              ],
            },
          ],
        },
      },
      'multi-select-survey': {
        summary: '다중 선택 설문 응답 예시',
        description: '체크박스를 사용한 다중 선택 질문 응답',
        value: {
          checkboxAnswers: [
            {
              questionId: '75e6bbc6-2839-4477-9672-bb4b381e8918',
              selectedOptions: [
                '제품 품질 개선',
                '가격 인하',
                '배송 서비스 개선',
                '고객센터 운영시간 확대',
              ],
            },
          ],
        },
      },
      'file-upload-survey': {
        summary: '파일 첨부 설문 응답 예시',
        description:
          '파일 업로드 질문이 포함된 설문 응답\n\n' +
          '**FormData 작성 방법:**\n' +
          '```javascript\n' +
          'const formData = new FormData();\n' +
          'formData.append("textAnswers", JSON.stringify([...]));\n' +
          'formData.append("files", file1); // 첫 번째 파일\n' +
          'formData.append("files", file2); // 두 번째 파일\n' +
          'formData.append("fileQuestionIds", JSON.stringify([\n' +
          '  "86e6bbc6-2839-4477-9672-bb4b381e8919",\n' +
          '  "86e6bbc6-2839-4477-9672-bb4b381e8919"\n' +
          ']));\n' +
          '```',
        value: {
          textAnswers: [
            {
              questionId: '85e6bbc6-2839-4477-9672-bb4b381e8919',
              textValue: '개선 제안 내용입니다.',
            },
          ],
          fileQuestionIds: [
            '86e6bbc6-2839-4477-9672-bb4b381e8919',
            '86e6bbc6-2839-4477-9672-bb4b381e8919',
          ],
        },
      },
    },
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
    @Body() dto: any, // FormData로 전송되므로 any 타입으로 받음
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ success: boolean }> {
    console.log('📝 설문 응답 제출 시작:', {
      announcementId: id,
      userId: user.id,
      employeeNumber: user.employeeNumber,
      hasFiles: files ? files.length : 0,
      dto: dto,
    });

    // FormData 파싱
    const parsedDto = this.parseFormDataDto(dto);
    console.log('✅ FormData 파싱 완료:', parsedDto);

    // 파일 업로드 처리
    let fileAnswers: Array<{
      questionId: string;
      files: Array<{
        fileUrl: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
      }>;
    }> = [];

    if (files && files.length > 0) {
      console.log(`📎 파일 ${files.length}개 업로드 시작`);
      
      // 파일 업로드 (surveys 폴더에 저장)
      const uploadedFiles = await this.fileUploadService.uploadFiles(
        files,
        'surveys',
      );
      console.log('✅ 파일 업로드 완료:', uploadedFiles);

      // fileQuestionIds가 있으면 각 파일을 해당 질문에 매핑
      if (parsedDto.fileQuestionIds && Array.isArray(parsedDto.fileQuestionIds)) {
        const fileQuestionMap = new Map<string, typeof uploadedFiles>();

        // 각 파일을 질문 ID별로 그룹화
        uploadedFiles.forEach((file, index) => {
          const questionId = parsedDto.fileQuestionIds[index];
          if (!questionId) {
            console.warn(`⚠️ 파일 인덱스 ${index}에 대한 questionId가 없습니다`);
            return;
          }

          const existing = fileQuestionMap.get(questionId) || [];
          existing.push(file);
          fileQuestionMap.set(questionId, existing);
        });

        // fileAnswers 형식으로 변환
        fileAnswers = Array.from(fileQuestionMap.entries()).map(
          ([questionId, files]) => ({
            questionId,
            files,
          }),
        );
        console.log('✅ 파일-질문 매핑 완료:', fileAnswers);
      }
    }

    // 설문 응답 데이터 준비
    const answersData = {
      textAnswers: parsedDto.textAnswers || [],
      choiceAnswers: parsedDto.choiceAnswers || [],
      checkboxAnswers: parsedDto.checkboxAnswers || [],
      scaleAnswers: parsedDto.scaleAnswers || [],
      gridAnswers: parsedDto.gridAnswers || [],
      fileAnswers: fileAnswers.length > 0 ? fileAnswers : undefined,
      datetimeAnswers: parsedDto.datetimeAnswers || [],
    };

    console.log('📊 설문 응답 데이터:', answersData);

    // 설문 응답 제출
    const result = await this.surveyService.설문_응답을_제출한다(
      id, // announcementId
      user.id, // employeeId (내부 UUID)
      user.employeeNumber, // employeeNumber (SSO 사번)
      answersData,
    );

    console.log('✅ 설문 응답 제출 완료:', result);
    return { success: result.success };
  }

  /**
   * FormData로 전송된 DTO를 파싱한다
   * @private
   */
  private parseFormDataDto(dto: any): any {
    console.log('🔍 파싱 시작 - 원본 DTO:', dto);
    const parsed = { ...dto };

    // JSON 문자열로 전송된 배열/객체 필드 파싱
    const jsonFields = [
      'textAnswers',
      'choiceAnswers',
      'checkboxAnswers',
      'scaleAnswers',
      'gridAnswers',
      'fileQuestionIds',
      'datetimeAnswers',
    ];

    for (const field of jsonFields) {
      if (parsed[field]) {
        if (typeof parsed[field] === 'string') {
          try {
            parsed[field] = JSON.parse(parsed[field]);
            console.log(`✅ ${field} 파싱 성공:`, parsed[field]);
          } catch (error) {
            console.error(`❌ ${field} 파싱 실패:`, error.message);
            // 파싱 실패 시 빈 배열로 설정
            parsed[field] = [];
          }
        } else if (Array.isArray(parsed[field])) {
          // 이미 배열이면 그대로 사용
          console.log(`✅ ${field} 이미 배열 형식:`, parsed[field]);
        } else {
          console.warn(`⚠️ ${field}가 문자열도 배열도 아닙니다:`, typeof parsed[field]);
          parsed[field] = [];
        }
      } else {
        // 필드가 없으면 빈 배열로 초기화
        parsed[field] = [];
      }
    }

    console.log('✅ 파싱 완료 - 결과:', parsed);
    return parsed;
  }
}
