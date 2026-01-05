import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateElectronicNoticeDto,
  UpdateElectronicNoticeDto,
  CreateElectronicNoticeCategoryDto,
  UpdateElectronicNoticeCategoryDto,
  CreateElectronicNoticeTranslationDto,
  UpdateElectronicNoticeTranslationDto,
  CreateElectronicNoticeAttachmentDto,
  UpdateElectronicNoticeAttachmentDto,
} from './dto/electronic-notice.dto';
import * as Decorators from './decorators/electronic-notice.decorators';

@ApiTags('electronic-notices')
@Controller('electronic-notices')
export class ElectronicNoticeController {
  // ========== 전자공시 문서 CRUD ==========
  @Get()
  @Decorators.GetAllElectronicNotices()
  async 전자공시_목록을_조회_한다(@Query('code') code?: string) {
    return [];
  }

  @Get(':id')
  @Decorators.GetElectronicNotice()
  async 전자공시를_조회_한다(@Param('id') id: string) {
    return {};
  }

  @Post()
  @Decorators.CreateElectronicNotice()
  async 전자공시를_생성_한다(@Body() createDto: CreateElectronicNoticeDto) {
    return {};
  }

  @Put(':id')
  @Decorators.UpdateElectronicNotice()
  async 전자공시를_수정_한다(@Param('id') id: string, @Body() updateDto: UpdateElectronicNoticeDto) {
    return {};
  }

  @Delete(':id')
  @Decorators.DeleteElectronicNotice()
  async 전자공시를_삭제_한다(@Param('id') id: string) {}

  // ========== 카테고리 CRUD ==========
  @Get('categories')
  @Decorators.GetAllElectronicNoticeCategories()
  async 카테고리_목록을_조회_한다() {
    return [];
  }

  @Post('categories')
  @Decorators.CreateElectronicNoticeCategory()
  async 카테고리를_생성_한다(@Body() createDto: CreateElectronicNoticeCategoryDto) {
    return {};
  }

  @Put('categories/:id')
  @Decorators.UpdateElectronicNoticeCategory()
  async 카테고리를_수정_한다(@Param('id') id: string, @Body() updateDto: UpdateElectronicNoticeCategoryDto) {
    return {};
  }

  @Delete('categories/:id')
  @Decorators.DeleteElectronicNoticeCategory()
  async 카테고리를_삭제_한다(@Param('id') id: string) {}

  // ========== 번역 CRUD ==========
  @Get(':documentId/translations')
  @Decorators.GetElectronicNoticeTranslations()
  async 번역_목록을_조회_한다(@Param('documentId') documentId: string) {
    return [];
  }

  @Get(':documentId/translations/:languageId')
  @Decorators.GetElectronicNoticeTranslation()
  async 번역을_조회_한다(@Param('documentId') documentId: string, @Param('languageId') languageId: string) {
    return {};
  }

  @Post(':documentId/translations')
  @Decorators.CreateElectronicNoticeTranslation()
  async 번역을_생성_한다(@Body() createDto: CreateElectronicNoticeTranslationDto) {
    return {};
  }

  @Put(':documentId/translations/:languageId')
  @Decorators.UpdateElectronicNoticeTranslation()
  async 번역을_수정_한다(
    @Param('documentId') documentId: string,
    @Param('languageId') languageId: string,
    @Body() updateDto: UpdateElectronicNoticeTranslationDto,
  ) {
    return {};
  }

  @Delete(':documentId/translations/:languageId')
  @Decorators.DeleteElectronicNoticeTranslation()
  async 번역을_삭제_한다(@Param('documentId') documentId: string, @Param('languageId') languageId: string) {}

  // ========== 첨부파일 CRUD ==========
  @Get(':documentId/translations/:languageId/attachments')
  @Decorators.GetElectronicNoticeAttachments()
  async 첨부파일_목록을_조회_한다(@Param('documentId') documentId: string, @Param('languageId') languageId: string) {
    return [];
  }

  @Get(':documentId/translations/:languageId/attachments/:attachmentId')
  @Decorators.GetElectronicNoticeAttachment()
  async 첨부파일을_조회_한다(
    @Param('documentId') documentId: string,
    @Param('languageId') languageId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    return {};
  }

  @Post(':documentId/translations/:languageId/attachments')
  @Decorators.CreateElectronicNoticeAttachment()
  async 첨부파일을_생성_한다(@Body() createDto: CreateElectronicNoticeAttachmentDto) {
    return {};
  }

  @Put(':documentId/translations/:languageId/attachments/:attachmentId')
  @Decorators.UpdateElectronicNoticeAttachment()
  async 첨부파일을_수정_한다(
    @Param('documentId') documentId: string,
    @Param('languageId') languageId: string,
    @Param('attachmentId') attachmentId: string,
    @Body() updateDto: UpdateElectronicNoticeAttachmentDto,
  ) {
    return {};
  }

  @Delete(':documentId/translations/:languageId/attachments/:attachmentId')
  @Decorators.DeleteElectronicNoticeAttachment()
  async 첨부파일을_삭제_한다(
    @Param('documentId') documentId: string,
    @Param('languageId') languageId: string,
    @Param('attachmentId') attachmentId: string,
  ) {}
}
