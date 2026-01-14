import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AnnouncementBusinessService } from '@business/announcement-business/announcement-business.service';
import {
  OrganizationInfoResponseDto,
  DepartmentListResponseDto,
  RankListResponseDto,
  PositionListResponseDto,
} from '@interface/common/dto/company/company-response.dto';

@ApiTags('공통. 관리자 - 회사 관련')
@ApiBearerAuth('Bearer')
@Controller('admin/company')
export class CompanyController {
  constructor(
    private readonly announcementBusinessService: AnnouncementBusinessService,
  ) {}

  /**
   * 조직 정보를 가져온다 (SSO)
   */
  @Get('organizations')
  @ApiOperation({
    summary: '조직 정보 조회',
    description: 'SSO 서버로부터 전체 조직 구조를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조직 정보 조회 성공',
    type: OrganizationInfoResponseDto,
  })
  async 조직_정보를_가져온다(): Promise<OrganizationInfoResponseDto> {
    return await this.announcementBusinessService.조직_정보를_가져온다();
  }

  /**
   * 부서 정보를 가져온다 (SSO)
   */
  @Get('organizations/departments')
  @ApiOperation({
    summary: '부서 정보 조회',
    description: 'SSO 서버로부터 부서 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '부서 정보 조회 성공',
    type: DepartmentListResponseDto,
  })
  async 부서_정보를_가져온다(): Promise<DepartmentListResponseDto> {
    return await this.announcementBusinessService.부서_정보를_가져온다();
  }

  /**
   * 직급 정보를 가져온다 (SSO)
   */
  @Get('organizations/ranks')
  @ApiOperation({
    summary: '직급 정보 조회',
    description: 'SSO 서버로부터 직급 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '직급 정보 조회 성공',
    type: RankListResponseDto,
  })
  async 직급_정보를_가져온다(): Promise<RankListResponseDto> {
    const ranks = await this.announcementBusinessService.직급_정보를_가져온다();
    return {
      items: ranks,
      total: ranks.length,
    };
  }

  /**
   * 직책 정보를 가져온다 (SSO)
   */
  @Get('organizations/positions')
  @ApiOperation({
    summary: '직책 정보 조회',
    description: 'SSO 서버로부터 직책 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '직책 정보 조회 성공',
    type: PositionListResponseDto,
  })
  async 직책_정보를_가져온다(): Promise<PositionListResponseDto> {
    const positions =
      await this.announcementBusinessService.직책_정보를_가져온다();
    return {
      items: positions,
      total: positions.length,
    };
  }
}
