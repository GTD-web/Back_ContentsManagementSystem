import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
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
  @ApiQuery({
    name: 'excludeExpired',
    required: false,
    description: '마감된 공지사항 제외 여부 (기본값: false)',
    type: Boolean,
  })
  async 공지사항_목록을_조회한다(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('categoryId') categoryId?: string,
    @Query('excludeExpired') excludeExpired?: string,
  ): Promise<AnnouncementListResponseDto> {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const excludeExpiredFilter = excludeExpired === 'true';

    // 사용자 권한에 따른 필터링 로직 적용
    // - 전사공개(isPublic: true) 공지사항
    // - 사용자의 부서/직급/직책이 포함된 제한공개 공지사항
    // - 사용자 ID가 permissionEmployeeIds에 포함된 공지사항
    const result =
      await this.announcementBusinessService.공지사항_목록을_사용자_권한으로_조회한다({
        userId: user.id,
        employeeNumber: user.employeeNumber,
        page: pageNum,
        limit: limitNum,
        orderBy: 'order',
        categoryId: categoryId,
        excludeExpired: excludeExpiredFilter,
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

    // 4. 응답 반환 (각 질문에 답변 포함)
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
              announcement.survey.questions?.map((q) => {
                // 질문 타입에 따라 답변 찾기
                let myAnswer: any = null;

                if (myAnswers) {
                  switch (q.type) {
                    case 'short_answer':
                    case 'paragraph':
                      const textAnswer = myAnswers.textAnswers?.find(
                        (a) => a.questionId === q.id,
                      );
                      if (textAnswer) {
                        myAnswer = { textValue: textAnswer.textValue };
                      }
                      break;

                    case 'multiple_choice':
                    case 'dropdown':
                      const choiceAnswer = myAnswers.choiceAnswers?.find(
                        (a) => a.questionId === q.id,
                      );
                      if (choiceAnswer) {
                        myAnswer = { selectedOption: choiceAnswer.selectedOption };
                      }
                      break;

                    case 'checkboxes':
                      const checkboxAnswer = myAnswers.checkboxAnswers?.find(
                        (a) => a.questionId === q.id,
                      );
                      if (checkboxAnswer) {
                        myAnswer = { selectedOptions: checkboxAnswer.selectedOptions };
                      }
                      break;

                    case 'linear_scale':
                      const scaleAnswer = myAnswers.scaleAnswers?.find(
                        (a) => a.questionId === q.id,
                      );
                      if (scaleAnswer) {
                        myAnswer = { scaleValue: scaleAnswer.scaleValue };
                      }
                      break;

                    case 'grid_scale':
                      const gridAnswer = myAnswers.gridAnswers?.find(
                        (a) => a.questionId === q.id,
                      );
                      if (gridAnswer) {
                        myAnswer = { gridAnswers: gridAnswer.gridAnswers };
                      }
                      break;

                    case 'file_upload':
                      const fileAnswer = myAnswers.fileAnswers?.find(
                        (a) => a.questionId === q.id,
                      );
                      if (fileAnswer) {
                        myAnswer = { files: fileAnswer.files };
                      }
                      break;

                    case 'datetime':
                      const datetimeAnswer = myAnswers.datetimeAnswers?.find(
                        (a) => a.questionId === q.id,
                      );
                      if (datetimeAnswer) {
                        myAnswer = { datetimeValue: datetimeAnswer.datetimeValue };
                      }
                      break;
                  }
                }

                return {
                  id: q.id,
                  title: q.title,
                  type: q.type,
                  form: q.form,
                  isRequired: q.isRequired,
                  order: q.order,
                  myAnswer, // 각 질문에 답변 포함
                };
              }) || [],
            createdAt: announcement.survey.createdAt,
            updatedAt: announcement.survey.updatedAt,
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
      '**📋 요청 데이터 형식:**\n\n' +
      '```json\n' +
      '{\n' +
      '  "answers": [\n' +
      '    { "questionId": "질문1-UUID", "value": 3 },              // 척도형 (숫자)\n' +
      '    { "questionId": "질문2-UUID", "value": "텍스트 답변" },   // 텍스트 (문자열)\n' +
      '    { "questionId": "질문3-UUID", "value": "옵션1" },        // 선택형 (문자열)\n' +
      '    { "questionId": "질문4-UUID", "value": ["옵션1", "옵션2"] } // 체크박스 (배열)\n' +
      '  ]\n' +
      '}\n' +
      '```\n\n' +
      '**파일 업로드 (백엔드에서 자동으로 S3 업로드):**\n' +
      '- 파일 첨부 시 `Content-Type: multipart/form-data` 사용\n' +
      '- `answers`: JSON 문자열로 전송\n' +
      '- `files`: 실제 파일들 (최대 20개)\n' +
      '- `fileQuestionIds`: 각 파일이 속한 질문 ID 배열 (JSON 문자열)\n' +
      '  - 예: `["질문-UUID", "질문-UUID"]`\n' +
      '  - `files` 배열과 같은 순서로 매칭됩니다\n\n' +
      '**FormData 예시 (파일 포함):**\n' +
      '```javascript\n' +
      'const formData = new FormData();\n' +
      'formData.append("answers", JSON.stringify([...]));\n' +
      'formData.append("files", file1);\n' +
      'formData.append("files", file2);\n' +
      'formData.append("fileQuestionIds", JSON.stringify(["질문-UUID", "질문-UUID"]));\n' +
      '```\n\n' +
      '⚠️ **주의사항:**\n' +
      '- 백엔드에서 질문 타입을 자동 인식하여 적절한 테이블에 저장\n' +
      '- 필수 질문(`isRequired: true`)은 반드시 응답 필요\n' +
      '- 선택형/체크박스 응답은 질문의 `options`에 정의된 값만 사용 가능',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID',
    type: String,
  })
  @ApiBody({
    description:
      '설문 응답 데이터 (JSON 또는 FormData)\n\n' +
      '**중요 사항**:\n' +
      '1. `answers` 배열에 모든 응답을 담아서 전송\n' +
      '2. 각 응답의 `value` 타입은 질문 타입에 따라 다름:\n' +
      '   - 텍스트/선택형: 문자열\n' +
      '   - 척도형: 숫자\n' +
      '   - 체크박스: 문자열 배열\n' +
      '   - 그리드: 객체 배열\n' +
      '3. 필수 질문(`isRequired: true`)은 반드시 응답해야 함\n' +
      '4. 파일 첨부 시에는 FormData 사용 필수\n' +
      '5. 백엔드에서 자동으로 S3에 업로드',
    examples: {
      basic: {
        summary: '기본 설문 응답 (JSON)',
        description: '텍스트, 선택형, 척도형, 체크박스 등 다양한 질문 타입 응답',
        value: {
          answers: [
            {
              questionId: 'a27b0d00-f21b-4e77-afe8-995af4ceaa40',
              value: 8, // 척도형 (1-10)
            },
            {
              questionId: '3bfccccb-3914-4363-90a7-b0be26540189',
              value: '교육 내용이 유익했습니다.', // 텍스트
            },
            {
              questionId: 'e278ab3c-b52e-486e-a0c2-d6432d6c0e00',
              value: '매우 만족', // 선택형
            },
            {
              questionId: '854c1290-1f5c-49ec-97eb-a6e244d662d2',
              value: ['강의 자료', '실습 기회', '강사 역량'], // 체크박스
            },
          ],
        },
      },
      'with-files': {
        summary: '파일 첨부 포함 (FormData)',
        description:
          '파일 업로드가 포함된 설문 응답\n\n' +
          '**FormData 작성 방법:**\n' +
          '```javascript\n' +
          'const formData = new FormData();\n' +
          'formData.append("answers", JSON.stringify([\n' +
          '  { questionId: "질문1-UUID", value: "답변" },\n' +
          '  { questionId: "질문2-UUID", value: 5 }\n' +
          ']));\n' +
          'formData.append("files", file1);\n' +
          'formData.append("files", file2);\n' +
          'formData.append("fileQuestionIds", JSON.stringify([\n' +
          '  "파일질문-UUID",\n' +
          '  "파일질문-UUID"\n' +
          ']));\n' +
          '```',
        value: {
          answers: [
            {
              questionId: '85e6bbc6-2839-4477-9672-bb4b381e8919',
              value: '개선 제안 내용입니다.',
            },
            {
              questionId: '95e6bbc6-2839-4477-9672-bb4b381e8920',
              value: 7,
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

    // answers 배열 검증
    if (!parsedDto.answers || !Array.isArray(parsedDto.answers) || parsedDto.answers.length === 0) {
      throw new Error('answers 배열이 필요합니다');
    }

    console.log('🔄 질문 타입별로 자동 변환 시작');
    
    // 설문조사 정보 조회
    const survey = await this.surveyService.공지사항ID로_설문조사를_조회한다(id);
    if (!survey) {
      throw new Error('설문조사를 찾을 수 없습니다');
    }

    // 질문 ID -> 질문 타입 매핑
    const questionTypeMap = new Map(
      survey.questions.map(q => [q.id, q.type])
    );

    // answers 배열을 질문 타입별로 분류
    const answersData: any = {
      textAnswers: [],
      choiceAnswers: [],
      checkboxAnswers: [],
      scaleAnswers: [],
      gridAnswers: [],
      datetimeAnswers: [],
    };

    for (const answer of parsedDto.answers) {
      const questionType = questionTypeMap.get(answer.questionId);
      
      if (!questionType) {
        console.warn(`⚠️ 질문 ID ${answer.questionId}의 타입을 찾을 수 없습니다`);
        continue;
      }

      switch (questionType) {
        case 'short_answer':
        case 'paragraph':
          answersData.textAnswers.push({
            questionId: answer.questionId,
            textValue: String(answer.value),
          });
          break;

        case 'multiple_choice':
        case 'dropdown':
          answersData.choiceAnswers.push({
            questionId: answer.questionId,
            selectedOption: String(answer.value),
          });
          break;

        case 'checkboxes':
          answersData.checkboxAnswers.push({
            questionId: answer.questionId,
            selectedOptions: Array.isArray(answer.value) ? answer.value : [answer.value],
          });
          break;

        case 'linear_scale':
          answersData.scaleAnswers.push({
            questionId: answer.questionId,
            scaleValue: Number(answer.value),
          });
          break;

        case 'datetime':
          answersData.datetimeAnswers.push({
            questionId: answer.questionId,
            datetimeValue: String(answer.value),
          });
          break;

        case 'grid_scale':
          if (Array.isArray(answer.value)) {
            answersData.gridAnswers.push({
              questionId: answer.questionId,
              gridAnswers: answer.value,
            });
          }
          break;

        case 'file_upload':
          // 파일은 별도 처리 (아래에서 files로 처리)
          break;

        default:
          console.warn(`⚠️ 지원하지 않는 질문 타입: ${questionType}`);
      }
    }

    console.log('✅ 질문 타입별 변환 완료:', answersData);

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

    // 파일 응답 추가
    if (fileAnswers.length > 0) {
      answersData.fileAnswers = fileAnswers;
    }

    console.log('📊 최종 설문 응답 데이터:', JSON.stringify(answersData, null, 2));

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
   * 공지사항 설문 응답 파일을 개별 삭제한다
   */
  @Delete(':id/survey/answers/files')
  @ApiOperation({
    summary: '설문 응답 파일 개별 삭제',
    description:
      '본인이 제출한 설문 응답 파일을 개별 삭제합니다.\n\n' +
      '**쿼리 파라미터:**\n' +
      '- `fileUrl`: 삭제할 파일의 URL (필수)\n\n' +
      '⚠️ **주의사항:**\n' +
      '- 본인이 제출한 파일만 삭제할 수 있습니다\n' +
      '- 파일 URL은 정확히 일치해야 합니다\n' +
      '- DB 레코드만 삭제되며, S3 객체는 삭제되지 않습니다',
  })
  @ApiParam({
    name: 'id',
    description: '공지사항 ID (UUID)',
    type: String,
    required: true,
  })
  @ApiQuery({
    name: 'fileUrl',
    description: '삭제할 설문 응답 파일의 URL',
    type: String,
    required: true,
    example:
      'https://lumir-admin.s3.ap-northeast-2.amazonaws.com/surveys/xxx.jpg',
  })
  @ApiResponse({
    status: 200,
    description: '파일 삭제 성공',
    schema: {
      type: 'object',
      properties: { success: { type: 'boolean', example: true } },
    },
  })
  @ApiResponse({
    status: 404,
    description: '공지사항/설문을 찾을 수 없거나, 해당 파일이 없거나 삭제 권한이 없음',
  })
  async 공지사항_설문_응답_파일을_삭제한다(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('fileUrl') fileUrl: string,
  ): Promise<{ success: boolean }> {
    if (!fileUrl || typeof fileUrl !== 'string' || fileUrl.trim() === '') {
      throw new BadRequestException('fileUrl 쿼리 파라미터가 필요합니다.');
    }
    return this.surveyService.설문_응답_파일을_삭제한다(
      id,
      user.id,
      fileUrl.trim(),
    );
  }

  /**
   * FormData로 전송된 DTO를 파싱한다
   * @private
   */
  private parseFormDataDto(dto: any): any {
    console.log('🔍 파싱 시작 - 원본 DTO:', dto);
    const parsed = { ...dto };

    // JSON 문자열로 전송된 배열/객체 필드 파싱
    const jsonFields = ['answers', 'fileQuestionIds'];

    for (const field of jsonFields) {
      if (parsed[field]) {
        if (typeof parsed[field] === 'string') {
          try {
            parsed[field] = JSON.parse(parsed[field]);
            console.log(`✅ ${field} 파싱 성공:`, parsed[field]);
          } catch (error) {
            console.error(`❌ ${field} 파싱 실패:`, error.message);
            parsed[field] = [];
          }
        } else if (Array.isArray(parsed[field])) {
          console.log(`✅ ${field} 이미 배열 형식:`, parsed[field]);
        } else {
          console.warn(`⚠️ ${field}가 문자열도 배열도 아닙니다:`, typeof parsed[field]);
          parsed[field] = [];
        }
      } else {
        parsed[field] = [];
      }
    }

    console.log('✅ 파싱 완료 - 결과:', parsed);
    return parsed;
  }
}
