import { Injectable, Logger } from '@nestjs/common';
import { ElectronicDisclosureService } from '@domain/core/electronic-disclosure/electronic-disclosure.service';
import { ElectronicDisclosure } from '@domain/core/electronic-disclosure/electronic-disclosure.entity';

/**
 * 전자공시 컨텍스트 서비스
 *
 * 전자공시 생성, 수정, 삭제 및 조회 비즈니스 로직을 담당합니다.
 */
@Injectable()
export class ElectronicDisclosureContextService {
  private readonly logger = new Logger(ElectronicDisclosureContextService.name);

  constructor(
    private readonly electronicDisclosureService: ElectronicDisclosureService,
  ) {}

  /**
   * 전자공시 전체 목록을 조회한다
   */
  async 전자공시_전체_목록을_조회한다(): Promise<ElectronicDisclosure[]> {
    return await this.electronicDisclosureService.모든_전자공시를_조회한다({
      orderBy: 'order',
    });
  }

  /**
   * 전자공시 상세를 조회한다
   */
  async 전자공시_상세를_조회한다(id: string): Promise<ElectronicDisclosure> {
    return await this.electronicDisclosureService.ID로_전자공시를_조회한다(id);
  }

  /**
   * 전자공시를 삭제한다
   */
  async 전자공시를_삭제한다(id: string): Promise<boolean> {
    return await this.electronicDisclosureService.전자공시를_삭제한다(id);
  }

  /**
   * 전자공시 공개 여부를 변경한다
   */
  async 전자공시_공개를_수정한다(
    id: string,
    isPublic: boolean,
    updatedBy?: string,
  ): Promise<ElectronicDisclosure> {
    return await this.electronicDisclosureService.전자공시_공개_여부를_변경한다(
      id,
      isPublic,
      updatedBy,
    );
  }

  /**
   * 전자공시 파일을 수정한다
   */
  async 전자공시_파일을_수정한다(
    id: string,
    attachments: Array<{
      fileName: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
    }>,
    updatedBy?: string,
  ): Promise<ElectronicDisclosure> {
    return await this.electronicDisclosureService.전자공시를_업데이트한다(id, {
      attachments,
      updatedBy,
    });
  }

  /**
   * 전자공시를 생성한다
   */
  async 전자공시를_생성한다(
    translations: Array<{
      languageId: string;
      title: string;
      description?: string;
    }>,
    createdBy?: string,
    attachments?: Array<{
      fileName: string;
      fileUrl: string;
      fileSize: number;
      mimeType: string;
    }>,
  ): Promise<ElectronicDisclosure> {
    this.logger.log('전자공시 생성 시작');

    // 다음 순서 계산
    const nextOrder = await this.electronicDisclosureService.다음_순서를_계산한다();

    // 전자공시 생성
    const disclosure = await this.electronicDisclosureService.전자공시를_생성한다({
      isPublic: false, // 기본값: 비공개
      status: 'draft' as any, // 기본값: DRAFT
      order: nextOrder,
      attachments: attachments || null,
      createdBy,
    });

    // 번역 저장
    await this.electronicDisclosureService.전자공시_번역을_생성한다(
      disclosure.id,
      translations,
      createdBy,
    );

    // 번역 포함하여 재조회
    return await this.electronicDisclosureService.ID로_전자공시를_조회한다(
      disclosure.id,
    );
  }

  /**
   * 전자공시를 수정한다
   */
  async 전자공시를_수정한다(
    id: string,
    data: {
      isPublic?: boolean;
      status?: string;
      order?: number;
      translations?: Array<{
        id?: string;
        languageId: string;
        title: string;
        description?: string;
      }>;
      updatedBy?: string;
    },
  ): Promise<ElectronicDisclosure> {
    this.logger.log(`전자공시 수정 시작 - ID: ${id}`);

    // 전자공시 업데이트
    const updateData: any = {};
    if (data.isPublic !== undefined) updateData.isPublic = data.isPublic;
    if (data.status) updateData.status = data.status;
    if (data.order !== undefined) updateData.order = data.order;
    if (data.updatedBy) updateData.updatedBy = data.updatedBy;

    if (Object.keys(updateData).length > 0) {
      await this.electronicDisclosureService.전자공시를_업데이트한다(
        id,
        updateData,
      );
    }

    // 번역 업데이트 (제공된 경우)
    if (data.translations && data.translations.length > 0) {
      for (const translation of data.translations) {
        if (translation.id) {
          // 기존 번역 업데이트
          await this.electronicDisclosureService.전자공시_번역을_업데이트한다(
            translation.id,
            {
              title: translation.title,
              description: translation.description ?? undefined,
              updatedBy: data.updatedBy,
            },
          );
        } else {
          // 새 번역 생성
          await this.electronicDisclosureService.전자공시_번역을_생성한다(
            id,
            [
              {
                languageId: translation.languageId,
                title: translation.title,
                description: translation.description,
              },
            ],
            data.updatedBy,
          );
        }
      }
    }

    // 번역 포함하여 재조회
    return await this.electronicDisclosureService.ID로_전자공시를_조회한다(id);
  }

  /**
   * 전자공시 오더를 수정한다
   */
  async 전자공시_오더를_수정한다(
    id: string,
    order: number,
    updatedBy?: string,
  ): Promise<ElectronicDisclosure> {
    this.logger.log(`전자공시 오더 수정 - ID: ${id}, 오더: ${order}`);

    return await this.electronicDisclosureService.전자공시를_업데이트한다(id, {
      order,
      updatedBy,
    });
  }

  /**
   * 전자공시 목록을 조회한다 (페이징)
   */
  async 전자공시_목록을_조회한다(
    isPublic?: boolean,
    orderBy: 'order' | 'createdAt' = 'order',
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    items: ElectronicDisclosure[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    this.logger.log(
      `전자공시 목록 조회 - 페이지: ${page}, 개수: ${limit}, 공개: ${isPublic}`,
    );

    // 전체 목록 조회
    const allDisclosures =
      await this.electronicDisclosureService.모든_전자공시를_조회한다({
        isPublic,
        orderBy,
      });

    // 페이징 적용
    const total = allDisclosures.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const items = allDisclosures.slice(skip, skip + limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }
}
