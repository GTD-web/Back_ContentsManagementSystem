import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageView } from './page-view.entity';

/**
 * PageView 도메인 서비스
 */
@Injectable()
export class PageViewService {
  constructor(
    @InjectRepository(PageView)
    private readonly pageViewRepository: Repository<PageView>,
  ) {}

  /**
   * 페이지 조회 통계를 생성한다
   */
  async 페이지_조회를_생성한다(pageView: Partial<PageView>): Promise<PageView> {
    const entity = this.pageViewRepository.create(pageView);
    return await this.pageViewRepository.save(entity);
  }

  /**
   * 세션 ID로 페이지 조회 목록을 조회한다
   */
  async 세션_ID로_조회한다(sessionId: string): Promise<PageView[]> {
    return await this.pageViewRepository.find({
      where: { sessionId },
      order: { enterTime: 'ASC' },
    });
  }

  /**
   * 페이지별 조회 통계를 조회한다
   */
  async 페이지별_통계를_조회한다(
    startDate: Date,
    endDate: Date,
  ): Promise<{ pageName: string; count: number; avgDuration: number }[]> {
    return await this.pageViewRepository
      .createQueryBuilder('pv')
      .select('pv.pageName', 'pageName')
      .addSelect('COUNT(*)', 'count')
      .addSelect('AVG(pv.stayDuration)', 'avgDuration')
      .where('pv.enterTime >= :startDate', { startDate })
      .andWhere('pv.enterTime <= :endDate', { endDate })
      .groupBy('pv.pageName')
      .getRawMany();
  }

  /**
   * ID로 페이지 조회를 조회한다
   */
  async ID로_조회한다(id: string): Promise<PageView | null> {
    return await this.pageViewRepository.findOne({ where: { id } });
  }

  /**
   * 페이지 조회를 수정한다
   */
  async 페이지_조회를_수정한다(
    id: string,
    exitTime: Date,
    stayDuration: number,
  ): Promise<PageView> {
    await this.pageViewRepository.update(id, { exitTime, stayDuration });
    const updated = await this.ID로_조회한다(id);
    if (!updated) {
      throw new Error('페이지 조회를 찾을 수 없습니다.');
    }
    return updated;
  }

  /**
   * 총 방문 기록 수를 조회한다 (기간 내)
   */
  async 총_방문_기록_수를_조회한다(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    return await this.pageViewRepository
      .createQueryBuilder('pv')
      .where('pv.enterTime >= :startDate', { startDate })
      .andWhere('pv.enterTime <= :endDate', { endDate })
      .getCount();
  }

  /**
   * 총 방문자 수를 조회한다 (중복 제거된 세션 수)
   */
  async 총_방문자_수를_조회한다(
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.pageViewRepository
      .createQueryBuilder('pv')
      .select('COUNT(DISTINCT pv.sessionId)', 'count')
      .where('pv.enterTime >= :startDate', { startDate })
      .andWhere('pv.enterTime <= :endDate', { endDate })
      .getRawOne();

    return parseInt(result.count, 10) || 0;
  }

  /**
   * 최근 방문 기록을 조회한다
   */
  async 최근_방문_기록을_조회한다(limit: number): Promise<PageView[]> {
    return await this.pageViewRepository.find({
      order: { enterTime: 'DESC' },
      take: limit,
    });
  }

  /**
   * 페이지별 방문 수를 조회한다 (기간 내)
   */
  async 페이지별_방문_수를_조회한다(
    startDate: Date,
    endDate: Date,
  ): Promise<{ pageName: string; count: number }[]> {
    const result = await this.pageViewRepository
      .createQueryBuilder('pv')
      .select('pv.pageName', 'pageName')
      .addSelect('COUNT(*)', 'count')
      .where('pv.enterTime >= :startDate', { startDate })
      .andWhere('pv.enterTime <= :endDate', { endDate })
      .groupBy('pv.pageName')
      .orderBy('count', 'DESC')
      .getRawMany();

    return result.map((r) => ({
      pageName: r.pageName,
      count: parseInt(r.count, 10),
    }));
  }

  /**
   * 시간대별 방문 현황을 조회한다 (24시간)
   */
  async 시간대별_방문_현황을_조회한다(
    startDate: Date,
    endDate: Date,
  ): Promise<{ hour: number; count: number }[]> {
    const result = await this.pageViewRepository
      .createQueryBuilder('pv')
      .select("EXTRACT(HOUR FROM pv.enterTime AT TIME ZONE 'Asia/Seoul')", 'hour')
      .addSelect('COUNT(*)', 'count')
      .where('pv.enterTime >= :startDate', { startDate })
      .andWhere('pv.enterTime <= :endDate', { endDate })
      .groupBy('hour')
      .orderBy('hour', 'ASC')
      .getRawMany();

    return result.map((r) => ({
      hour: parseInt(r.hour, 10),
      count: parseInt(r.count, 10),
    }));
  }
}
