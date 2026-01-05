import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreatePopupDto,
  UpdatePopupDto,
  CreatePopupCategoryDto,
  UpdatePopupCategoryDto,
  CreatePopupTranslationDto,
  UpdatePopupTranslationDto,
  CreatePopupAttachmentDto,
  UpdatePopupAttachmentDto,
} from './dto/popup.dto';
import * as Decorators from './decorators/popup.decorators';

@ApiTags('popups')
@Controller('popups')
export class PopupController {
  @Get()
  @Decorators.GetAllPopups()
  async 팝업_목록을_조회_한다() {
    return [];
  }

  @Get(':id')
  @Decorators.GetPopup()
  async 팝업을_조회_한다(@Param('id') id: string) {
    return {};
  }

  @Post()
  @Decorators.CreatePopup()
  async 팝업을_생성_한다(@Body() createDto: CreatePopupDto) {
    return {};
  }

  @Put(':id')
  @Decorators.UpdatePopup()
  async 팝업을_수정_한다(@Param('id') id: string, @Body() updateDto: UpdatePopupDto) {
    return {};
  }

  @Delete(':id')
  @Decorators.DeletePopup()
  async 팝업을_삭제_한다(@Param('id') id: string) {}

  @Get('categories')
  @Decorators.GetAllPopupCategories()
  async 카테고리_목록을_조회_한다() {
    return [];
  }

  @Post('categories')
  @Decorators.CreatePopupCategory()
  async 카테고리를_생성_한다(@Body() createDto: CreatePopupCategoryDto) {
    return {};
  }

  @Put('categories/:id')
  @Decorators.UpdatePopupCategory()
  async 카테고리를_수정_한다(@Param('id') id: string, @Body() updateDto: UpdatePopupCategoryDto) {
    return {};
  }

  @Delete('categories/:id')
  @Decorators.DeletePopupCategory()
  async 카테고리를_삭제_한다(@Param('id') id: string) {}

  @Get(':documentId/translations')
  @Decorators.GetPopupTranslations()
  async 번역_목록을_조회_한다(@Param('documentId') documentId: string) {
    return [];
  }

  @Get(':documentId/translations/:languageId')
  @Decorators.GetPopupTranslation()
  async 번역을_조회_한다(@Param('documentId') documentId: string, @Param('languageId') languageId: string) {
    return {};
  }

  @Post(':documentId/translations')
  @Decorators.CreatePopupTranslation()
  async 번역을_생성_한다(@Body() createDto: CreatePopupTranslationDto) {
    return {};
  }

  @Put(':documentId/translations/:languageId')
  @Decorators.UpdatePopupTranslation()
  async 번역을_수정_한다(
    @Param('documentId') documentId: string,
    @Param('languageId') languageId: string,
    @Body() updateDto: UpdatePopupTranslationDto,
  ) {
    return {};
  }

  @Delete(':documentId/translations/:languageId')
  @Decorators.DeletePopupTranslation()
  async 번역을_삭제_한다(@Param('documentId') documentId: string, @Param('languageId') languageId: string) {}

  @Get(':documentId/translations/:languageId/attachments')
  @Decorators.GetPopupAttachments()
  async 첨부파일_목록을_조회_한다(@Param('documentId') documentId: string, @Param('languageId') languageId: string) {
    return [];
  }

  @Get(':documentId/translations/:languageId/attachments/:attachmentId')
  @Decorators.GetPopupAttachment()
  async 첨부파일을_조회_한다(
    @Param('documentId') documentId: string,
    @Param('languageId') languageId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    return {};
  }

  @Post(':documentId/translations/:languageId/attachments')
  @Decorators.CreatePopupAttachment()
  async 첨부파일을_생성_한다(@Body() createDto: CreatePopupAttachmentDto) {
    return {};
  }

  @Put(':documentId/translations/:languageId/attachments/:attachmentId')
  @Decorators.UpdatePopupAttachment()
  async 첨부파일을_수정_한다(
    @Param('documentId') documentId: string,
    @Param('languageId') languageId: string,
    @Param('attachmentId') attachmentId: string,
    @Body() updateDto: UpdatePopupAttachmentDto,
  ) {
    return {};
  }

  @Delete(':documentId/translations/:languageId/attachments/:attachmentId')
  @Decorators.DeletePopupAttachment()
  async 첨부파일을_삭제_한다(
    @Param('documentId') documentId: string,
    @Param('languageId') languageId: string,
    @Param('attachmentId') attachmentId: string,
  ) {}
}
