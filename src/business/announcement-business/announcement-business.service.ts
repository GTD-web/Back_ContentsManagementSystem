import { Injectable, Logger } from '@nestjs/common';
import { AnnouncementContextService } from '@context/announcement-context/announcement-context.service';
import { CompanyContextService } from '@context/company-context/company-context.service';
import { Announcement } from '@domain/core/announcement/announcement.entity';
import { ContentStatus } from '@domain/core/content-status.types';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from '@context/announcement-context/interfaces/announcement-context.interface';
import {
  OrganizationInfo,
  DepartmentListResult,
  RankListResult,
  PositionListResult,
} from '@context/company-context/interfaces/company-context.interface';

/**
 * 공지사항 비즈니스 서비스
 *
 * 공지사항 관련 비즈니스 로직을 오케스트레이션합니다.
 * - 컨텍스트 서비스 호출
 * - 여러 컨텍스트 간 조율
 * - SSO 조직 정보 연동
 */
@Injectable()
export class AnnouncementBusinessService {
  private readonly logger = new Logger(AnnouncementBusinessService.name);

  constructor(
    private readonly announcementContextService: AnnouncementContextService,
    private readonly companyContextService: CompanyContextService,
  ) {}

  /**
   * 공지사항 목록을 조회한다
   */
  async 공지사항_목록을_조회한다(params: {
    isPublic?: boolean;
    isFixed?: boolean;
    status?: ContentStatus;
    orderBy?: 'order' | 'createdAt';
    page?: number;
    limit?: number;
  }): Promise<{
    items: Announcement[];
    total: number;
    page: number;
    limit: number;
  }> {
    this.logger.log('공지사항 목록 조회 시작');

    const result =
      await this.announcementContextService.공지사항_목록을_조회한다(params);

    this.logger.log(`공지사항 목록 조회 완료 - 총 ${result.total}개`);

    return result;
  }

  /**
   * 공지사항 전체 목록을 조회한다 (페이지네이션 없음)
   */
  async 공지사항_전체_목록을_조회한다(): Promise<Announcement[]> {
    this.logger.log('공지사항 전체 목록 조회 시작');

    // 매우 큰 limit을 사용하여 전체 목록 조회
    const result =
      await this.announcementContextService.공지사항_목록을_조회한다({
        limit: 10000,
      });

    this.logger.log(`공지사항 전체 목록 조회 완료 - 총 ${result.total}개`);

    return result.items;
  }

  /**
   * 공지사항을 조회한다
   */
  async 공지사항을_조회한다(id: string): Promise<Announcement> {
    this.logger.log(`공지사항 조회 시작 - ID: ${id}`);

    const announcement =
      await this.announcementContextService.공지사항을_조회한다(id);

    this.logger.log(`공지사항 조회 완료 - ID: ${id}`);

    return announcement;
  }

  /**
   * 공지사항을 생성한다
   */
  async 공지사항을_생성한다(
    data: CreateAnnouncementDto,
  ): Promise<Announcement> {
    this.logger.log(`공지사항 생성 시작 - 제목: ${data.title}`);

    const result =
      await this.announcementContextService.공지사항을_생성한다(data);

    this.logger.log(`공지사항 생성 완료 - ID: ${result.id}`);

    // 생성 후 상세 정보 조회
    return await this.announcementContextService.공지사항을_조회한다(result.id);
  }

  /**
   * 공지사항을 수정한다
   */
  async 공지사항을_수정한다(
    id: string,
    data: UpdateAnnouncementDto,
  ): Promise<Announcement> {
    this.logger.log(`공지사항 수정 시작 - ID: ${id}`);

    const result =
      await this.announcementContextService.공지사항을_수정한다(id, data);

    this.logger.log(`공지사항 수정 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 공지사항_공개를_수정한다
   */
  async 공지사항_공개를_수정한다(
    id: string,
    isPublic: boolean,
    updatedBy?: string,
  ): Promise<Announcement> {
    this.logger.log(`공지사항 공개 상태 수정 시작 - ID: ${id}, 공개: ${isPublic}`);

    const result =
      await this.announcementContextService.공지사항_공개를_수정한다(id, {
        isPublic,
        updatedBy,
      });

    this.logger.log(`공지사항 공개 상태 수정 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 공지사항_고정을_수정한다
   */
  async 공지사항_고정을_수정한다(
    id: string,
    isFixed: boolean,
    updatedBy?: string,
  ): Promise<Announcement> {
    this.logger.log(`공지사항 고정 상태 수정 시작 - ID: ${id}, 고정: ${isFixed}`);

    const result =
      await this.announcementContextService.공지사항_고정을_수정한다(id, {
        isFixed,
        updatedBy,
      });

    this.logger.log(`공지사항 고정 상태 수정 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 공지사항_오더를_수정한다
   */
  async 공지사항_오더를_수정한다(
    id: string,
    order: number,
    updatedBy?: string,
  ): Promise<Announcement> {
    this.logger.log(`공지사항 오더 수정 시작 - ID: ${id}, Order: ${order}`);

    const result =
      await this.announcementContextService.공지사항_오더를_수정한다(id, {
        order,
        updatedBy,
      });

    this.logger.log(`공지사항 오더 수정 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 공지사항을 삭제한다
   */
  async 공지사항을_삭제한다(id: string): Promise<boolean> {
    this.logger.log(`공지사항 삭제 시작 - ID: ${id}`);

    const result = await this.announcementContextService.공지사항을_삭제한다(id);

    this.logger.log(`공지사항 삭제 완료 - ID: ${id}`);

    return result;
  }

  /**
   * 조직 정보를 가져온다 (SSO)
   */
  async 조직_정보를_가져온다(): Promise<OrganizationInfo> {
    this.logger.log('조직 정보 조회 시작 (SSO)');

    const result = await this.companyContextService.조직_정보를_가져온다();

    this.logger.log('조직 정보 조회 완료 (SSO)');

    return result;
  }

  /**
   * 부서 정보를 가져온다 (SSO)
   */
  async 부서_정보를_가져온다(): Promise<DepartmentListResult> {
    this.logger.log('부서 정보 조회 시작 (SSO)');

    const result = await this.companyContextService.부서_정보를_가져온다();

    this.logger.log('부서 정보 조회 완료 (SSO)');

    return result;
  }

  /**
   * 직급 정보를 가져온다 (SSO)
   */
  async 직급_정보를_가져온다(): Promise<RankListResult> {
    this.logger.log('직급 정보 조회 시작 (SSO)');

    const result = await this.companyContextService.직급_정보를_가져온다();

    this.logger.log('직급 정보 조회 완료 (SSO)');

    return result;
  }

  /**
   * 직책 정보를 가져온다 (SSO)
   */
  async 직책_정보를_가져온다(): Promise<PositionListResult> {
    this.logger.log('직책 정보 조회 시작 (SSO)');

    const result = await this.companyContextService.직책_정보를_가져온다();

    this.logger.log('직책 정보 조회 완료 (SSO)');

    return result;
  }
}
