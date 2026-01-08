import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './news.entity';
import { ContentStatus } from '../content-status.types';

/**
 * 뉴스 서비스
 * 언론 보도 및 뉴스 관리 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class NewsService {
  private readonly logger = new Logger(NewsService.name);

  constructor(
    @InjectRepository(News)
    private readonly repository: Repository<News>,
  ) {}

  /**
   * 뉴스를 생성한다
   */
  async 뉴스를_생성한다(data: Partial<News>): Promise<News> {
    this.logger.log(`뉴스 생성 시작 - 제목: ${data.title}`);

    const news = this.repository.create(data);
    const saved = await this.repository.save(news);

    this.logger.log(`뉴스 생성 완료 - ID: ${saved.id}`);
    return saved;
  }

  /**
   * 모든 뉴스를 조회한다
   */
  async 모든_뉴스를_조회한다(options?: {
    status?: ContentStatus;
    isPublic?: boolean;
  }): Promise<News[]> {
    this.logger.debug(`뉴스 목록 조회`);

    const queryBuilder = this.repository.createQueryBuilder('news');

    if (options?.status) {
      queryBuilder.where('news.status = :status', { status: options.status });
    }

    if (options?.isPublic !== undefined) {
      queryBuilder.andWhere('news.isPublic = :isPublic', {
        isPublic: options.isPublic,
      });
    }

    return await queryBuilder
      .orderBy('news.order', 'DESC')
      .addOrderBy('news.createdAt', 'DESC')
      .getMany();
  }

  /**
   * ID로 뉴스를 조회한다
   */
  async ID로_뉴스를_조회한다(id: string): Promise<News> {
    this.logger.debug(`뉴스 조회 - ID: ${id}`);

    const news = await this.repository.findOne({ where: { id } });

    if (!news) {
      throw new NotFoundException(`뉴스를 찾을 수 없습니다. ID: ${id}`);
    }

    return news;
  }

  /**
   * 뉴스를 업데이트한다
   */
  async 뉴스를_업데이트한다(
    id: string,
    data: Partial<News>,
  ): Promise<News> {
    this.logger.log(`뉴스 업데이트 시작 - ID: ${id}`);

    const news = await this.ID로_뉴스를_조회한다(id);

    Object.assign(news, data);

    const updated = await this.repository.save(news);

    this.logger.log(`뉴스 업데이트 완료 - ID: ${id}`);
    return updated;
  }

  /**
   * 뉴스를 삭제한다 (Soft Delete)
   */
  async 뉴스를_삭제한다(id: string): Promise<boolean> {
    this.logger.log(`뉴스 삭제 시작 - ID: ${id}`);

    const news = await this.ID로_뉴스를_조회한다(id);

    await this.repository.softRemove(news);

    this.logger.log(`뉴스 삭제 완료 - ID: ${id}`);
    return true;
  }

  /**
   * 뉴스 상태를 변경한다
   */
  async 뉴스_상태를_변경한다(
    id: string,
    status: ContentStatus,
    updatedBy?: string,
  ): Promise<News> {
    this.logger.log(`뉴스 상태 변경 - ID: ${id}, 상태: ${status}`);

    return await this.뉴스를_업데이트한다(id, { status, updatedBy });
  }

  /**
   * 공개된 뉴스를 조회한다
   */
  async 공개된_뉴스를_조회한다(): Promise<News[]> {
    this.logger.debug(`공개된 뉴스 조회`);

    return await this.repository.find({
      where: {
        status: ContentStatus.OPENED,
        isPublic: true,
      },
      order: {
        order: 'DESC',
        createdAt: 'DESC',
      },
    });
  }
}
