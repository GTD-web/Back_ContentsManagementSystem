import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnouncementPopup } from './announcement-popup.entity';
import { AnnouncementPopupDto } from './announcement-popup.types';

/**
 * 공지사항 팝업 서비스
 *
 * 공지사항 팝업 엔티티에 대한 CRUD 작업을 제공합니다.
 */
@Injectable()
export class AnnouncementPopupService {
  constructor(
    @InjectRepository(AnnouncementPopup)
    private readonly announcementPopupRepository: Repository<AnnouncementPopup>,
  ) {}

  /**
   * 모든 공지사항 팝업을 조회한다
   */
  async 모든_공지사항_팝업을_조회한다(): Promise<AnnouncementPopupDto[]> {
    const popups = await this.announcementPopupRepository.find({
      relations: ['manager'],
    });
    return popups.map((popup) => popup.DTO로_변환한다());
  }

  /**
   * ID로 공지사항 팝업을 조회한다
   */
  async ID로_공지사항_팝업을_조회한다(
    id: string,
  ): Promise<AnnouncementPopupDto | null> {
    const popup = await this.announcementPopupRepository.findOne({
      where: { id },
      relations: ['manager'],
    });
    return popup ? popup.DTO로_변환한다() : null;
  }

  /**
   * 공지사항 팝업을 생성한다
   */
  async 공지사항_팝업을_생성한다(
    popup: AnnouncementPopup,
  ): Promise<AnnouncementPopupDto> {
    const savedPopup = await this.announcementPopupRepository.save(popup);
    return savedPopup.DTO로_변환한다();
  }

  /**
   * 공지사항 팝업을 수정한다
   */
  async 공지사항_팝업을_수정한다(
    id: string,
    updateData: Partial<AnnouncementPopup>,
  ): Promise<AnnouncementPopupDto | null> {
    await this.announcementPopupRepository.update(id, updateData);
    return this.ID로_공지사항_팝업을_조회한다(id);
  }

  /**
   * 공지사항 팝업을 삭제한다
   */
  async 공지사항_팝업을_삭제한다(id: string): Promise<void> {
    await this.announcementPopupRepository.softDelete(id);
  }

  /**
   * 공개된 공지사항 팝업을 조회한다
   */
  async 공개된_공지사항_팝업을_조회한다(): Promise<AnnouncementPopupDto[]> {
    const popups = await this.announcementPopupRepository.find({
      where: { isPublic: true },
      relations: ['manager'],
    });
    return popups.map((popup) => popup.DTO로_변환한다());
  }
}
