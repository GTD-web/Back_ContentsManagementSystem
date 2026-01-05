import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from '@domain/core/news/news.entity';
import type { NewsDto } from '@domain/core/news/news.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 뉴스 비즈니스 서비스
 *
 * @description
 * - News Entity와 NewsDto 간의 변환을 담당합니다.
 * - 뉴스 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private readonly newsRepository: Repository<News>,
  ) {}

  /**
   * 뉴스 목록을 조회한다
   */
  async 뉴스_목록을_조회_한다(code?: string): Promise<ApiResponse<NewsDto[]>> {
    const queryBuilder = this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.manager', 'manager')
      .orderBy('news.createdAt', 'DESC');

    // code 필터 추가 (필요시)
    if (code) {
      queryBuilder.andWhere('news.category->code = :code', { code });
    }

    const newsList = await queryBuilder.getMany();
    const newsDtos = newsList.map((news) => news.DTO로_변환한다());

    return successResponse(newsDtos, '뉴스 목록을 성공적으로 조회했습니다.');
  }

  /**
   * 뉴스 상세 정보를 조회한다
   */
  async 뉴스를_조회_한다(newsId: string): Promise<ApiResponse<NewsDto>> {
    const news = await this.newsRepository.findOne({
      where: { id: newsId },
      relations: ['manager'],
    });

    if (!news) {
      throw new Error(`뉴스를 찾을 수 없습니다. ID: ${newsId}`);
    }

    return successResponse(news.DTO로_변환한다(), '뉴스 정보를 성공적으로 조회했습니다.');
  }

  /**
   * 뉴스를 생성한다
   */
  async 뉴스를_생성_한다(data: Partial<NewsDto>): Promise<ApiResponse<NewsDto>> {
    const news = this.newsRepository.create(data as any);
    const savedNews = await this.newsRepository.save(news);
    
    // TypeORM save는 단일 엔티티 또는 배열을 반환할 수 있음
    const result = Array.isArray(savedNews) ? savedNews[0] : savedNews;

    return successResponse(result.DTO로_변환한다(), '뉴스가 성공적으로 생성되었습니다.');
  }

  /**
   * 뉴스를 수정한다
   */
  async 뉴스를_수정_한다(
    newsId: string,
    data: Partial<NewsDto>,
  ): Promise<ApiResponse<NewsDto>> {
    const news = await this.newsRepository.findOne({
      where: { id: newsId },
      relations: ['manager'],
    });

    if (!news) {
      throw new Error(`뉴스를 찾을 수 없습니다. ID: ${newsId}`);
    }

    Object.assign(news, data);
    const updatedNews = await this.newsRepository.save(news);

    return successResponse(updatedNews.DTO로_변환한다(), '뉴스가 성공적으로 수정되었습니다.');
  }

  /**
   * 뉴스를 삭제한다 (Soft Delete)
   */
  async 뉴스를_삭제_한다(newsId: string): Promise<ApiResponse<void>> {
    const result = await this.newsRepository.softDelete(newsId);

    if (result.affected === 0) {
      throw new Error(`뉴스를 찾을 수 없습니다. ID: ${newsId}`);
    }

    return successResponse(undefined as any, '뉴스가 성공적으로 삭제되었습니다.');
  }

  /**
   * 뉴스를 공개한다
   */
  async 뉴스를_공개_한다(newsId: string): Promise<ApiResponse<NewsDto>> {
    const news = await this.newsRepository.findOne({
      where: { id: newsId },
      relations: ['manager'],
    });

    if (!news) {
      throw new Error(`뉴스를 찾을 수 없습니다. ID: ${newsId}`);
    }

    news.공개한다();
    const updatedNews = await this.newsRepository.save(news);

    return successResponse(updatedNews.DTO로_변환한다(), '뉴스가 성공적으로 공개되었습니다.');
  }

  /**
   * 뉴스를 비공개한다
   */
  async 뉴스를_비공개_한다(newsId: string): Promise<ApiResponse<NewsDto>> {
    const news = await this.newsRepository.findOne({
      where: { id: newsId },
      relations: ['manager'],
    });

    if (!news) {
      throw new Error(`뉴스를 찾을 수 없습니다. ID: ${newsId}`);
    }

    news.비공개한다();
    const updatedNews = await this.newsRepository.save(news);

    return successResponse(updatedNews.DTO로_변환한다(), '뉴스가 성공적으로 비공개되었습니다.');
  }
}
