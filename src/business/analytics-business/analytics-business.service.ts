import { Injectable, NotFoundException } from '@nestjs/common';
import { PageViewService } from '@domain/sub/analytics/page-view.service';
import {
  PageViewResponseDto,
  AnalyticsDashboardDto,
  RecentPageViewDto,
  PageVisitCountDto,
  HourlyVisitDto,
} from '@interface/common/dto/analytics/page-view-response.dto';
import { CreatePageViewDto } from '@interface/common/dto/analytics/create-page-view.dto';
import { UpdatePageViewDto } from '@interface/common/dto/analytics/update-page-view.dto';

/**
 * Analytics 비즈니스 서비스
 */
@Injectable()
export class AnalyticsBusinessService {
  constructor(private readonly pageViewService: PageViewService) {}

  /**
   * 페이지 조회를 생성한다
   */
  async 페이지_조회를_생성한다(
    createDto: CreatePageViewDto,
  ): Promise<PageViewResponseDto> {
    const pageView = await this.pageViewService.페이지_조회를_생성한다({
      sessionId: createDto.sessionId,
      pageName: createDto.pageName,
      title: createDto.title || null,
      enterTime: new Date(),
      exitTime: null,
      stayDuration: null,
    });

    return this.페이지_조회를_DTO로_변환한다(pageView);
  }

  /**
   * 페이지 조회를 수정한다 (퇴장 시간 및 체류 시간 기록)
   */
  async 페이지_조회를_수정한다(
    id: string,
    updateDto: UpdatePageViewDto,
  ): Promise<PageViewResponseDto> {
    const pageView = await this.pageViewService.ID로_조회한다(id);
    if (!pageView) {
      throw new NotFoundException('페이지 조회를 찾을 수 없습니다.');
    }

    const exitTime = new Date();
    const updated = await this.pageViewService.페이지_조회를_수정한다(
      id,
      exitTime,
      updateDto.stayDuration,
    );

    return this.페이지_조회를_DTO로_변환한다(updated);
  }

  /**
   * 분석 대시보드 데이터를 조회한다
   */
  async 분석_대시보드_데이터를_조회한다(): Promise<AnalyticsDashboardDto> {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // 총 방문 기록 (30일)
    const totalVisits =
      await this.pageViewService.총_방문_기록_수를_조회한다(
        thirtyDaysAgo,
        now,
      );

    // 총 방문자 수 (30일)
    const totalVisitors = await this.pageViewService.총_방문자_수를_조회한다(
      thirtyDaysAgo,
      now,
    );

    // 최근 방문 기록 (20개)
    const recentPageViews =
      await this.pageViewService.최근_방문_기록을_조회한다(20);
    const recentVisits: RecentPageViewDto[] = recentPageViews.map((pv) => ({
      pageName: pv.title || pv.pageName,
      visitTime: this.날짜를_포맷한다(pv.enterTime),
      stayDurationSeconds: pv.stayDuration
        ? Math.floor(pv.stayDuration / 1000)
        : null,
      category: this.카테고리를_추출한다(pv.pageName, pv.title),
    }));

    // 페이지별 방문수
    const pageVisitsData = await this.pageViewService.페이지별_방문_수를_조회한다(
      thirtyDaysAgo,
      now,
    );
    const pageVisits: PageVisitCountDto[] = pageVisitsData.map((pv) => ({
      pageName: this.페이지_이름을_포맷한다(pv.pageName),
      count: pv.count,
    }));

    // 시간대별 방문 현황 (24시간)
    const hourlyVisitsData =
      await this.pageViewService.시간대별_방문_현황을_조회한다(
        thirtyDaysAgo,
        now,
      );
    const hourlyVisits: HourlyVisitDto[] = hourlyVisitsData;

    return {
      totalVisits,
      totalVisitors,
      recentVisits,
      pageVisits,
      hourlyVisits,
    };
  }

  /**
   * 페이지 조회를 DTO로 변환한다
   */
  private 페이지_조회를_DTO로_변환한다(pageView: any): PageViewResponseDto {
    return {
      id: pageView.id,
      sessionId: pageView.sessionId,
      pageName: pageView.pageName,
      title: pageView.title,
      enterTime: pageView.enterTime,
      exitTime: pageView.exitTime,
      stayDuration: pageView.stayDuration,
      createdAt: pageView.createdAt,
    };
  }

  /**
   * 날짜를 포맷한다 (예: "2025. 12. 13. 오후 9:11:19")
   */
  private 날짜를_포맷한다(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;

    return `${year}. ${month}. ${day}. ${ampm} ${displayHours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  /**
   * 카테고리를 추출한다
   */
  private 카테고리를_추출한다(
    pageName: string,
    title: string | null,
  ): string {
    // 페이지 이름에서 카테고리 추출 로직
    // 예: "/admin/news" -> "뉴스 | 루미르"
    if (pageName.includes('news')) return '뉴스 | 루미르';
    if (pageName.includes('service')) return '서비스 | 루미르';
    if (pageName.includes('company')) return '회사소개 | 루미르';
    if (pageName.includes('ir')) return 'IR | 루미르';
    if (pageName.includes('announcement')) return '공지사항 | 루미르';
    if (title) return `${title} | 루미르`;
    return '루미르';
  }

  /**
   * 페이지 이름을 포맷한다
   */
  private 페이지_이름을_포맷한다(pageName: string): string {
    // URL에서 한글 이름으로 변환
    const mapping: { [key: string]: string } = {
      '/': '메인 페이지',
      '/admin': '관리자',
      '/news': '뉴스',
      '/service': '서비스',
      '/company': '회사소개',
      '/ir': 'IR',
      '/announcement': '공지사항',
      '/shareholders-meeting': '주주총회',
      '/electronic-disclosure': '전자공고',
      '/brochure': '브로셔',
      '/video': '비디오',
      '/story': '루미르 스토리',
    };

    return mapping[pageName] || pageName;
  }
}
