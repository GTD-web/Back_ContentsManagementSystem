import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { CategoryMapping } from './category-mapping.entity';
import { CategoryService } from './category.service';

/**
 * 카테고리 모듈
 * 통합 카테고리 관리 기능을 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryMapping])],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
