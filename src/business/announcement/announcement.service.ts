import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '@domain/core/announcement/announcement.entity';
import type { AnnouncementDto } from '@domain/core/announcement/announcement.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 공지사항 비즈니스 서비스
 *
 * @description
 * - Announcement Entity와 AnnouncementDto 간의 변환을 담당합니다.
 * - 공지사항 관련 비즈니스 로직을 처리합니다.
 * - 직원 목록 관리, 필독 설정, 조회수 증가 등의 기능을 제공합니다.
 */
@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
  ) {}

  /**
   * 공지사항 목록을 조회한다
   */
  async 공지사항_목록을_조회_한다(): Promise<ApiResponse<AnnouncementDto[]>> {
    const announcements = await this.announcementRepository.find({
      relations: ['manager'],
      order: {
        isFixed: 'DESC', // 고정 공지사항을 먼저 보여줌
        createdAt: 'DESC',
      },
    });

    const announcementDtos = announcements.map((announcement) =>
      announcement.DTO로_변환한다(),
    );

    return successResponse(
      announcementDtos,
      '공지사항 목록을 성공적으로 조회했습니다.',
    );
  }

  /**
   * 공지사항 상세 정보를 조회한다
   */
  async 공지사항을_조회_한다(
    announcementId: string,
  ): Promise<ApiResponse<AnnouncementDto>> {
    const announcement = await this.announcementRepository.findOne({
      where: { id: announcementId },
      relations: ['manager'],
    });

    if (!announcement) {
      throw new Error(`공지사항을 찾을 수 없습니다. ID: ${announcementId}`);
    }

    // 조회수 증가
    announcement.조회수를_증가한다();
    await this.announcementRepository.save(announcement);

    return successResponse(
      announcement.DTO로_변환한다(),
      '공지사항 정보를 성공적으로 조회했습니다.',
    );
  }

  /**
   * 공지사항을 생성한다
   */
  async 공지사항을_생성_한다(
    data: Partial<AnnouncementDto>,
  ): Promise<ApiResponse<AnnouncementDto>> {
    const announcement = this.announcementRepository.create(data as any);
    const savedAnnouncement = await this.announcementRepository.save(announcement);
    
    const result = Array.isArray(savedAnnouncement) ? savedAnnouncement[0] : savedAnnouncement;

    return successResponse(
      result.DTO로_변환한다(),
      '공지사항이 성공적으로 생성되었습니다.',
    );
  }

  /**
   * 공지사항을 수정한다
   */
  async 공지사항을_수정_한다(
    announcementId: string,
    data: Partial<AnnouncementDto>,
  ): Promise<ApiResponse<AnnouncementDto>> {
    const announcement = await this.announcementRepository.findOne({
      where: { id: announcementId },
      relations: ['manager'],
    });

    if (!announcement) {
      throw new Error(`공지사항을 찾을 수 없습니다. ID: ${announcementId}`);
    }

    Object.assign(announcement, data);
    const updatedAnnouncement = await this.announcementRepository.save(announcement);

    return successResponse(
      updatedAnnouncement.DTO로_변환한다(),
      '공지사항이 성공적으로 수정되었습니다.',
    );
  }

  /**
   * 공지사항을 삭제한다 (Soft Delete)
   */
  async 공지사항을_삭제_한다(
    announcementId: string,
  ): Promise<ApiResponse<void>> {
    const result = await this.announcementRepository.softDelete(announcementId);

    if (result.affected === 0) {
      throw new Error(`공지사항을 찾을 수 없습니다. ID: ${announcementId}`);
    }

    return successResponse(
      undefined as any,
      '공지사항이 성공적으로 삭제되었습니다.',
    );
  }

  /**
   * 공지사항을 상단에 고정한다
   */
  async 공지사항을_상단에_고정_한다(
    announcementId: string,
  ): Promise<ApiResponse<AnnouncementDto>> {
    const announcement = await this.announcementRepository.findOne({
      where: { id: announcementId },
      relations: ['manager'],
    });

    if (!announcement) {
      throw new Error(`공지사항을 찾을 수 없습니다. ID: ${announcementId}`);
    }

    announcement.isFixed = true;
    const updatedAnnouncement = await this.announcementRepository.save(announcement);

    return successResponse(
      updatedAnnouncement.DTO로_변환한다(),
      '공지사항이 성공적으로 상단에 고정되었습니다.',
    );
  }

  /**
   * 공지사항 상단 고정을 해제한다
   */
  async 공지사항_상단_고정을_해제_한다(
    announcementId: string,
  ): Promise<ApiResponse<AnnouncementDto>> {
    const announcement = await this.announcementRepository.findOne({
      where: { id: announcementId },
      relations: ['manager'],
    });

    if (!announcement) {
      throw new Error(`공지사항을 찾을 수 없습니다. ID: ${announcementId}`);
    }

    announcement.isFixed = false;
    const updatedAnnouncement = await this.announcementRepository.save(announcement);

    return successResponse(
      updatedAnnouncement.DTO로_변환한다(),
      '공지사항 상단 고정이 성공적으로 해제되었습니다.',
    );
  }

  /**
   * 직원이 공지사항을 읽음 처리한다
   */
  async 직원이_공지사항을_읽음_처리_한다(
    announcementId: string,
    employeeId: string,
  ): Promise<ApiResponse<AnnouncementDto>> {
    const announcement = await this.announcementRepository.findOne({
      where: { id: announcementId },
      relations: ['manager'],
    });

    if (!announcement) {
      throw new Error(`공지사항을 찾을 수 없습니다. ID: ${announcementId}`);
    }

    announcement.직원이_읽음_처리한다(employeeId);
    const updatedAnnouncement = await this.announcementRepository.save(announcement);

    return successResponse(
      updatedAnnouncement.DTO로_변환한다(),
      '공지사항이 성공적으로 읽음 처리되었습니다.',
    );
  }

  /**
   * 직원이 공지사항에 응답한다
   */
  async 직원이_공지사항에_응답_한다(
    announcementId: string,
    employeeId: string,
    responseMessage?: string,
  ): Promise<ApiResponse<AnnouncementDto>> {
    const announcement = await this.announcementRepository.findOne({
      where: { id: announcementId },
      relations: ['manager'],
    });

    if (!announcement) {
      throw new Error(`공지사항을 찾을 수 없습니다. ID: ${announcementId}`);
    }

    announcement.직원이_응답을_제출한다(employeeId, responseMessage || '');
    const updatedAnnouncement = await this.announcementRepository.save(announcement);

    return successResponse(
      updatedAnnouncement.DTO로_변환한다(),
      '공지사항 응답이 성공적으로 제출되었습니다.',
    );
  }
}
