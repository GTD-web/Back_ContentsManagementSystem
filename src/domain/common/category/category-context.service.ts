import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CategoryEntityType } from './category-entity-type.types';

/**
 * 카테고리 컨텍스트 서비스
 *
 * 서버 시작 시 기본 카테고리를 자동으로 생성합니다.
 */
@Injectable()
export class CategoryContextService implements OnModuleInit {
  private readonly logger = new Logger(CategoryContextService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * 모듈 초기화 시 기본 카테고리를 자동으로 추가한다
   */
  async onModuleInit() {
    try {
      this.logger.log('📁 서버 시작 시 기본 카테고리 초기화 시작...');

      // 기본 카테고리 목록
      const defaultCategories = [
        {
          entityType: CategoryEntityType.BROCHURE,
          name: '미분류',
          description: '기본 브로슈어 카테고리',
        },
        {
          entityType: CategoryEntityType.IR,
          name: '미분류',
          description: '기본 IR 카테고리',
        },
        {
          entityType: CategoryEntityType.ELECTRONIC_DISCLOSURE,
          name: '미분류',
          description: '기본 전자공시 카테고리',
        },
        {
          entityType: CategoryEntityType.SHAREHOLDERS_MEETING,
          name: '미분류',
          description: '기본 주주총회 카테고리',
        },
        {
          entityType: CategoryEntityType.ANNOUNCEMENT,
          name: '미분류',
          description: '기본 공지사항 카테고리',
        },
        {
          entityType: CategoryEntityType.LUMIR_STORY,
          name: '미분류',
          description: '기본 루미르 스토리 카테고리',
        },
        {
          entityType: CategoryEntityType.VIDEO_GALLERY,
          name: '미분류',
          description: '기본 비디오 갤러리 카테고리',
        },
        {
          entityType: CategoryEntityType.NEWS,
          name: '미분류',
          description: '기본 뉴스 카테고리',
        },
        {
          entityType: CategoryEntityType.MAIN_POPUP,
          name: '미분류',
          description: '기본 메인 팝업 카테고리',
        },
      ];

      const createdCategories: Category[] = [];

      for (const categoryData of defaultCategories) {
        // 이미 존재하는지 확인
        const existing = await this.categoryRepository.findOne({
          where: {
            entityType: categoryData.entityType,
            name: categoryData.name,
          },
        });

        if (!existing) {
          const category = this.categoryRepository.create({
            entityType: categoryData.entityType,
            name: categoryData.name,
            description: categoryData.description,
            isActive: true,
            order: 0,
            createdBy: 'system',
          });
          const saved = await this.categoryRepository.save(category);
          createdCategories.push(saved);

          this.logger.log(
            `   - ${this.엔티티_타입을_한글로_변환(categoryData.entityType)}: ${categoryData.name}`,
          );
        }
      }

      if (createdCategories.length > 0) {
        this.logger.log(
          `✅ 기본 카테고리 초기화 완료 - ${createdCategories.length}개 카테고리 추가됨`,
        );
      } else {
        this.logger.log('✅ 기본 카테고리가 이미 존재합니다.');
      }
    } catch (error) {
      this.logger.error('❌ 기본 카테고리 초기화 실패', error);
      // 에러가 발생해도 서버 시작은 계속 진행
    }
  }

  /**
   * 엔티티 타입을 한글로 변환한다
   */
  private 엔티티_타입을_한글로_변환(entityType: CategoryEntityType): string {
    const typeMap = {
      [CategoryEntityType.BROCHURE]: '브로슈어',
      [CategoryEntityType.IR]: 'IR 자료',
      [CategoryEntityType.ELECTRONIC_DISCLOSURE]: '전자공시',
      [CategoryEntityType.SHAREHOLDERS_MEETING]: '주주총회',
      [CategoryEntityType.ANNOUNCEMENT]: '공지사항',
      [CategoryEntityType.LUMIR_STORY]: '루미르 스토리',
      [CategoryEntityType.VIDEO_GALLERY]: '비디오 갤러리',
      [CategoryEntityType.NEWS]: '뉴스',
      [CategoryEntityType.MAIN_POPUP]: '메인 팝업',
      [CategoryEntityType.EDUCATION_MANAGEMENT]: '교육 관리',
    };

    return typeMap[entityType] || entityType;
  }
}
