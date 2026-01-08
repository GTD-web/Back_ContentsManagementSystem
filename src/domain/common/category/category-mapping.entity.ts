import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Index,
} from 'typeorm';
import { Category } from './category.entity';

/**
 * CategoryMapping Entity (카테고리 매핑)
 * 
 * 엔티티와 카테고리 간 다대다 관계 관리
 * 정규화된 구조로 유연한 카테고리 할당
 */
@Entity('category_mappings')
@Index('idx_category_mapping_entity_id', ['entityId'])
@Index('idx_category_mapping_category_id', ['categoryId'])
@Index('uk_category_mapping_entity_category', ['entityId', 'categoryId'], {
  unique: true,
})
export class CategoryMapping {
  @PrimaryGeneratedColumn('uuid', {
    comment: '카테고리 매핑 ID',
  })
  id: string;

  @Column({
    type: 'uuid',
    comment: '엔티티 ID (다형성: 어떤 엔티티든 참조 가능)',
  })
  entityId: string;

  @Column({
    type: 'uuid',
    comment: '카테고리 ID',
  })
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '생성 일시',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    comment: '수정 일시',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
    comment: '삭제 일시 (Soft Delete)',
  })
  deletedAt: Date | null;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: '생성자 ID (외부 시스템 직원 ID - SSO)',
  })
  createdBy: string | null;

  @Column({
    type: 'uuid',
    nullable: true,
    comment: '수정자 ID (외부 시스템 직원 ID - SSO)',
  })
  updatedBy: string | null;

  @VersionColumn({
    comment: '버전 (Optimistic Locking)',
  })
  version: number;
}
