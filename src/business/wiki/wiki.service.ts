import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wiki } from '@domain/sub/wiki/wiki.entity';
import type { WikiDto } from '@domain/sub/wiki/wiki.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 위키 비즈니스 서비스
 *
 * @description
 * - Wiki Entity와 WikiDto 간의 변환을 담당합니다.
 * - 위키 관련 비즈니스 로직을 처리합니다.
 * - 파일 시스템 관리, 검색 등의 기능을 제공합니다.
 */
@Injectable()
export class WikiService {
  constructor(
    @InjectRepository(Wiki)
    private readonly wikiRepository: Repository<Wiki>,
  ) {}

  /**
   * 위키 목록을 조회한다
   */
  async 위키_목록을_조회_한다(): Promise<ApiResponse<WikiDto[]>> {
    const wikis = await this.wikiRepository.find({
      order: {
        updatedAt: 'DESC',
      },
    });

    const wikiDtos = wikis.map((wiki) => wiki.DTO로_변환한다());

    return successResponse(
      wikiDtos,
      '위키 목록을 성공적으로 조회했습니다.',
    );
  }

  /**
   * 위키 상세 정보를 조회한다
   */
  async 위키를_조회_한다(wikiId: string): Promise<ApiResponse<WikiDto>> {
    const wiki = await this.wikiRepository.findOne({
      where: { id: wikiId },
    });

    if (!wiki) {
      throw new Error(`위키를 찾을 수 없습니다. ID: ${wikiId}`);
    }

    return successResponse(
      wiki.DTO로_변환한다(),
      '위키 정보를 성공적으로 조회했습니다.',
    );
  }

  /**
   * 위키를 생성한다
   */
  async 위키를_생성_한다(
    data: Partial<WikiDto>,
  ): Promise<ApiResponse<WikiDto>> {
    const wiki = this.wikiRepository.create(data as any);
    const savedWiki = await this.wikiRepository.save(wiki);
    
    const result = Array.isArray(savedWiki) ? savedWiki[0] : savedWiki;

    return successResponse(
      result.DTO로_변환한다(),
      '위키가 성공적으로 생성되었습니다.',
    );
  }

  /**
   * 위키를 수정한다
   */
  async 위키를_수정_한다(
    wikiId: string,
    data: Partial<WikiDto>,
  ): Promise<ApiResponse<WikiDto>> {
    const wiki = await this.wikiRepository.findOne({
      where: { id: wikiId },
    });

    if (!wiki) {
      throw new Error(`위키를 찾을 수 없습니다. ID: ${wikiId}`);
    }

    Object.assign(wiki, data);
    const updatedWiki = await this.wikiRepository.save(wiki);

    return successResponse(
      updatedWiki.DTO로_변환한다(),
      '위키가 성공적으로 수정되었습니다.',
    );
  }

  /**
   * 위키를 삭제한다 (Soft Delete)
   */
  async 위키를_삭제_한다(wikiId: string): Promise<ApiResponse<void>> {
    const result = await this.wikiRepository.softDelete(wikiId);

    if (result.affected === 0) {
      throw new Error(`위키를 찾을 수 없습니다. ID: ${wikiId}`);
    }

    return successResponse(
      undefined as any,
      '위키가 성공적으로 삭제되었습니다.',
    );
  }

  /**
   * 위키를 공개한다
   */
  async 위키를_공개_한다(wikiId: string): Promise<ApiResponse<WikiDto>> {
    const wiki = await this.wikiRepository.findOne({
      where: { id: wikiId },
    });

    if (!wiki) {
      throw new Error(`위키를 찾을 수 없습니다. ID: ${wikiId}`);
    }

    wiki.공개한다();
    const updatedWiki = await this.wikiRepository.save(wiki);

    return successResponse(
      updatedWiki.DTO로_변환한다(),
      '위키가 성공적으로 공개되었습니다.',
    );
  }

  /**
   * 위키를 비공개한다
   */
  async 위키를_비공개_한다(wikiId: string): Promise<ApiResponse<WikiDto>> {
    const wiki = await this.wikiRepository.findOne({
      where: { id: wikiId },
    });

    if (!wiki) {
      throw new Error(`위키를 찾을 수 없습니다. ID: ${wikiId}`);
    }

    wiki.비공개한다();
    const updatedWiki = await this.wikiRepository.save(wiki);

    return successResponse(
      updatedWiki.DTO로_변환한다(),
      '위키가 성공적으로 비공개되었습니다.',
    );
  }

  /**
   * 태그로 위키를 검색한다
   */
  async 태그로_검색_한다(tag: string): Promise<ApiResponse<WikiDto[]>> {
    const wikis = await this.wikiRepository
      .createQueryBuilder('wiki')
      .where(':tag = ANY(wiki.tags)', { tag })
      .orderBy('wiki.updatedAt', 'DESC')
      .getMany();

    const wikiDtos = wikis.map((wiki) => wiki.DTO로_변환한다());

    return successResponse(
      wikiDtos,
      `태그 '${tag}'로 위키를 성공적으로 검색했습니다.`,
    );
  }
}
