import { Controller, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
  AnnouncementResponseDto,
  CreateAnnouncementCategoryDto,
  UpdateAnnouncementCategoryDto,
  AnnouncementCategoryResponseDto,
  AnnouncementAttachmentResponseDto,
  AnnouncementTargetResponseDto,
  AnnouncementRespondedResponseDto,
} from './dto/announcement.dto';
import {
  GetAllAnnouncements,
  GetAnnouncement,
  CreateAnnouncement,
  UpdateAnnouncement,
  DeleteAnnouncement,
  GetAllCategories,
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
  GetAnnouncementAttachments,
  GetAnnouncementTargets,
  GetAnnouncementResponses,
} from './decorators/announcement.decorators';

/**
 * 공지사항 컨트롤러
 *
 * 공지사항 관련 API 엔드포인트를 제공합니다.
 */
@ApiTags('공지사항')
@Controller('announcements')
export class AnnouncementController {
  // ========== 공지사항 CRUD ==========

  /**
   * 모든 공지사항을 조회한다
   */
  @GetAllAnnouncements()
  async getAllAnnouncements(): Promise<AnnouncementResponseDto[]> {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }

  /**
   * 특정 공지사항을 조회한다
   */
  @GetAnnouncement()
  async getAnnouncement(
    @Param('id') id: string,
  ): Promise<AnnouncementResponseDto> {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }

  /**
   * 공지사항을 생성한다
   */
  @CreateAnnouncement()
  async createAnnouncement(
    @Body() dto: CreateAnnouncementDto,
  ): Promise<AnnouncementResponseDto> {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }

  /**
   * 공지사항을 수정한다
   */
  @UpdateAnnouncement()
  async updateAnnouncement(
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementDto,
  ): Promise<AnnouncementResponseDto> {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }

  /**
   * 공지사항을 삭제한다
   */
  @DeleteAnnouncement()
  async deleteAnnouncement(@Param('id') id: string): Promise<void> {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }

  // ========== 카테고리 CRUD ==========

  /**
   * 모든 카테고리를 조회한다
   */
  @GetAllCategories()
  async getAllCategories(): Promise<AnnouncementCategoryResponseDto[]> {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }

  /**
   * 카테고리를 생성한다
   */
  @CreateCategory()
  async createCategory(
    @Body() dto: CreateAnnouncementCategoryDto,
  ): Promise<AnnouncementCategoryResponseDto> {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }

  /**
   * 카테고리를 수정한다
   */
  @UpdateCategory()
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementCategoryDto,
  ): Promise<AnnouncementCategoryResponseDto> {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }

  /**
   * 카테고리를 삭제한다
   */
  @DeleteCategory()
  async deleteCategory(@Param('id') id: string): Promise<void> {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }

  // ========== 기타 조회 ==========

  /**
   * 공지사항의 첨부파일 목록을 조회한다
   */
  @GetAnnouncementAttachments()
  async getAnnouncementAttachments(
    @Param('id') id: string,
  ): Promise<AnnouncementAttachmentResponseDto[]> {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }

  /**
   * 공지사항의 대상자 목록을 조회한다
   */
  @GetAnnouncementTargets()
  async getAnnouncementTargets(
    @Param('id') id: string,
  ): Promise<AnnouncementTargetResponseDto[]> {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }

  /**
   * 공지사항의 응답 상태 목록을 조회한다
   */
  @GetAnnouncementResponses()
  async getAnnouncementResponses(
    @Param('id') id: string,
  ): Promise<AnnouncementRespondedResponseDto[]> {
    // Business Layer 구현 필요
    throw new Error('Business Layer 구현 필요');
  }
}
