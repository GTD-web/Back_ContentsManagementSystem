import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoGallery } from '@domain/sub/video-gallery/video-gallery.entity';
import type { VideoGalleryDto } from '@domain/sub/video-gallery/video-gallery.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 비디오 갤러리 비즈니스 서비스
 *
 * @description
 * - VideoGallery Entity와 VideoGalleryDto 간의 변환을 담당합니다.
 * - 비디오 갤러리 관련 비즈니스 로직을 처리합니다.
 */
@Injectable()
export class VideoGalleryService {
  constructor(
    @InjectRepository(VideoGallery)
    private readonly videoRepository: Repository<VideoGallery>,
  ) {}

  /**
   * 비디오 갤러리 목록을 조회한다
   */
  async 비디오_갤러리_목록을_조회_한다(
    code?: string,
  ): Promise<ApiResponse<VideoGalleryDto[]>> {
    const queryBuilder = this.videoRepository
      .createQueryBuilder('video')
      .leftJoinAndSelect('video.manager', 'manager')
      .orderBy('video.createdAt', 'DESC');

    // code 필터 추가 (필요시)
    if (code) {
      queryBuilder.andWhere('video.category->>code = :code', { code });
    }

    const videos = await queryBuilder.getMany();
    const videoDtos = videos.map((video) => video.DTO로_변환한다());

    return successResponse(
      videoDtos,
      '비디오 갤러리 목록을 성공적으로 조회했습니다.',
    );
  }

  /**
   * 비디오 갤러리 상세 정보를 조회한다
   */
  async 비디오_갤러리를_조회_한다(
    videoId: string,
  ): Promise<ApiResponse<VideoGalleryDto>> {
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
      relations: ['manager'],
    });

    if (!video) {
      throw new Error(`비디오 갤러리를 찾을 수 없습니다. ID: ${videoId}`);
    }

    return successResponse(
      video.DTO로_변환한다(),
      '비디오 갤러리 정보를 성공적으로 조회했습니다.',
    );
  }

  /**
   * 비디오 갤러리를 생성한다
   */
  async 비디오_갤러리를_생성_한다(
    data: Partial<VideoGalleryDto>,
  ): Promise<ApiResponse<VideoGalleryDto>> {
    const video = this.videoRepository.create(data as any);
    const savedVideo = await this.videoRepository.save(video);
    
    const result = Array.isArray(savedVideo) ? savedVideo[0] : savedVideo;

    return successResponse(
      result.DTO로_변환한다(),
      '비디오 갤러리가 성공적으로 생성되었습니다.',
    );
  }

  /**
   * 비디오 갤러리를 수정한다
   */
  async 비디오_갤러리를_수정_한다(
    videoId: string,
    data: Partial<VideoGalleryDto>,
  ): Promise<ApiResponse<VideoGalleryDto>> {
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
      relations: ['manager'],
    });

    if (!video) {
      throw new Error(`비디오 갤러리를 찾을 수 없습니다. ID: ${videoId}`);
    }

    Object.assign(video, data);
    const updatedVideo = await this.videoRepository.save(video);

    return successResponse(
      updatedVideo.DTO로_변환한다(),
      '비디오 갤러리가 성공적으로 수정되었습니다.',
    );
  }

  /**
   * 비디오 갤러리를 삭제한다 (Soft Delete)
   */
  async 비디오_갤러리를_삭제_한다(videoId: string): Promise<ApiResponse<void>> {
    const result = await this.videoRepository.softDelete(videoId);

    if (result.affected === 0) {
      throw new Error(`비디오 갤러리를 찾을 수 없습니다. ID: ${videoId}`);
    }

    return successResponse(
      undefined as any,
      '비디오 갤러리가 성공적으로 삭제되었습니다.',
    );
  }

  /**
   * 비디오 갤러리를 공개한다
   */
  async 비디오_갤러리를_공개_한다(
    videoId: string,
  ): Promise<ApiResponse<VideoGalleryDto>> {
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
      relations: ['manager'],
    });

    if (!video) {
      throw new Error(`비디오 갤러리를 찾을 수 없습니다. ID: ${videoId}`);
    }

    video.공개한다();
    const updatedVideo = await this.videoRepository.save(video);

    return successResponse(
      updatedVideo.DTO로_변환한다(),
      '비디오 갤러리가 성공적으로 공개되었습니다.',
    );
  }

  /**
   * 비디오 갤러리를 비공개한다
   */
  async 비디오_갤러리를_비공개_한다(
    videoId: string,
  ): Promise<ApiResponse<VideoGalleryDto>> {
    const video = await this.videoRepository.findOne({
      where: { id: videoId },
      relations: ['manager'],
    });

    if (!video) {
      throw new Error(`비디오 갤러리를 찾을 수 없습니다. ID: ${videoId}`);
    }

    video.비공개한다();
    const updatedVideo = await this.videoRepository.save(video);

    return successResponse(
      updatedVideo.DTO로_변환한다(),
      '비디오 갤러리가 성공적으로 비공개되었습니다.',
    );
  }
}
