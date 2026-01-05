import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LumirStory } from '@domain/sub/lumir-story/lumir-story.entity';
import type { LumirStoryDto } from '@domain/sub/lumir-story/lumir-story.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 루미르 스토리 비즈니스 서비스
 *
 * @description
 * - LumirStory Entity와 LumirStoryDto 간의 변환을 담당합니다.
 * - 루미르 스토리 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class LumirStoryService {
  constructor(
    @InjectRepository(LumirStory)
    private readonly storyRepository: Repository<LumirStory>,
  ) {}

  /**
   * 루미르 스토리 목록을 조회한다
   */
  async 루미르_스토리_목록을_조회_한다(
    code?: string,
  ): Promise<ApiResponse<LumirStoryDto[]>> {
    const queryBuilder = this.storyRepository
      .createQueryBuilder('story')
      .leftJoinAndSelect('story.manager', 'manager')
      .orderBy('story.createdAt', 'DESC');

    // code 필터 추가 (필요시)
    if (code) {
      queryBuilder.andWhere('story.category->>code = :code', { code });
    }

    const stories = await queryBuilder.getMany();
    const storyDtos = stories.map((story) => story.DTO로_변환한다());

    return successResponse(
      storyDtos,
      '루미르 스토리 목록을 성공적으로 조회했습니다.',
    );
  }

  /**
   * 루미르 스토리 상세 정보를 조회한다
   */
  async 루미르_스토리를_조회_한다(
    storyId: string,
  ): Promise<ApiResponse<LumirStoryDto>> {
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
      relations: ['manager'],
    });

    if (!story) {
      throw new Error(`루미르 스토리를 찾을 수 없습니다. ID: ${storyId}`);
    }

    return successResponse(
      story.DTO로_변환한다(),
      '루미르 스토리 정보를 성공적으로 조회했습니다.',
    );
  }

  /**
   * 루미르 스토리를 생성한다
   */
  async 루미르_스토리를_생성_한다(
    data: Partial<LumirStoryDto>,
  ): Promise<ApiResponse<LumirStoryDto>> {
    const story = this.storyRepository.create(data as any);
    const savedStory = await this.storyRepository.save(story);
    
    const result = Array.isArray(savedStory) ? savedStory[0] : savedStory;

    return successResponse(
      result.DTO로_변환한다(),
      '루미르 스토리가 성공적으로 생성되었습니다.',
    );
  }

  /**
   * 루미르 스토리를 수정한다
   */
  async 루미르_스토리를_수정_한다(
    storyId: string,
    data: Partial<LumirStoryDto>,
  ): Promise<ApiResponse<LumirStoryDto>> {
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
      relations: ['manager'],
    });

    if (!story) {
      throw new Error(`루미르 스토리를 찾을 수 없습니다. ID: ${storyId}`);
    }

    Object.assign(story, data);
    const updatedStory = await this.storyRepository.save(story);

    return successResponse(
      updatedStory.DTO로_변환한다(),
      '루미르 스토리가 성공적으로 수정되었습니다.',
    );
  }

  /**
   * 루미르 스토리를 삭제한다 (Soft Delete)
   */
  async 루미르_스토리를_삭제_한다(storyId: string): Promise<ApiResponse<void>> {
    const result = await this.storyRepository.softDelete(storyId);

    if (result.affected === 0) {
      throw new Error(`루미르 스토리를 찾을 수 없습니다. ID: ${storyId}`);
    }

    return successResponse(
      undefined as any,
      '루미르 스토리가 성공적으로 삭제되었습니다.',
    );
  }

  /**
   * 루미르 스토리를 공개한다
   */
  async 루미르_스토리를_공개_한다(
    storyId: string,
  ): Promise<ApiResponse<LumirStoryDto>> {
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
      relations: ['manager'],
    });

    if (!story) {
      throw new Error(`루미르 스토리를 찾을 수 없습니다. ID: ${storyId}`);
    }

    story.공개한다();
    const updatedStory = await this.storyRepository.save(story);

    return successResponse(
      updatedStory.DTO로_변환한다(),
      '루미르 스토리가 성공적으로 공개되었습니다.',
    );
  }

  /**
   * 루미르 스토리를 비공개한다
   */
  async 루미르_스토리를_비공개_한다(
    storyId: string,
  ): Promise<ApiResponse<LumirStoryDto>> {
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
      relations: ['manager'],
    });

    if (!story) {
      throw new Error(`루미르 스토리를 찾을 수 없습니다. ID: ${storyId}`);
    }

    story.비공개한다();
    const updatedStory = await this.storyRepository.save(story);

    return successResponse(
      updatedStory.DTO로_변환한다(),
      '루미르 스토리가 성공적으로 비공개되었습니다.',
    );
  }
}
