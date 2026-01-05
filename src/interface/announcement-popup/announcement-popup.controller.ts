import { Controller, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AnnouncementPopupService } from '@domain/core/announcement-popup';
import {
  CreateAnnouncementPopupDto,
  UpdateAnnouncementPopupDto,
  AnnouncementPopupResponseDto,
} from './dto/announcement-popup.dto';
import {
  GetAllAnnouncementPopups,
  GetAnnouncementPopup,
  CreateAnnouncementPopup,
  UpdateAnnouncementPopup,
  DeleteAnnouncementPopup,
} from './decorators/announcement-popup.decorators';

/**
 * 공지사항 팝업 컨트롤러
 *
 * 공지사항 팝업 관련 API 엔드포인트를 제공합니다.
 */
@ApiTags('공지사항 팝업')
@Controller('announcement-popups')
export class AnnouncementPopupController {
  constructor(
    private readonly announcementPopupService: AnnouncementPopupService,
  ) {}

  /**
   * 모든 공지사항 팝업을 조회한다
   */
  @GetAllAnnouncementPopups()
  async getAllAnnouncementPopups(): Promise<AnnouncementPopupResponseDto[]> {
    const popups =
      await this.announcementPopupService.모든_공지사항_팝업을_조회한다();
    return popups as unknown as AnnouncementPopupResponseDto[];
  }

  /**
   * ID로 공지사항 팝업을 조회한다
   */
  @GetAnnouncementPopup()
  async getAnnouncementPopup(
    @Param('id') id: string,
  ): Promise<AnnouncementPopupResponseDto> {
    const popup =
      await this.announcementPopupService.ID로_공지사항_팝업을_조회한다(id);
    if (!popup) {
      throw new Error('공지사항 팝업을 찾을 수 없습니다');
    }
    return popup as unknown as AnnouncementPopupResponseDto;
  }

  /**
   * 공지사항 팝업을 생성한다
   */
  @CreateAnnouncementPopup()
  async createAnnouncementPopup(
    @Body() createDto: CreateAnnouncementPopupDto,
  ): Promise<AnnouncementPopupResponseDto> {
    // DTO를 Entity로 변환하는 로직은 Business Layer에서 처리
    throw new Error('Business Layer 구현 필요');
  }

  /**
   * 공지사항 팝업을 수정한다
   */
  @UpdateAnnouncementPopup()
  async updateAnnouncementPopup(
    @Param('id') id: string,
    @Body() updateDto: UpdateAnnouncementPopupDto,
  ): Promise<AnnouncementPopupResponseDto> {
    throw new Error('Business Layer 구현 필요');
  }

  /**
   * 공지사항 팝업을 삭제한다
   */
  @DeleteAnnouncementPopup()
  async deleteAnnouncementPopup(@Param('id') id: string): Promise<void> {
    await this.announcementPopupService.공지사항_팝업을_삭제한다(id);
  }
}
