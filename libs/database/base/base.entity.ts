import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Column,
} from 'typeorm';

/**
 * 기본 엔티티 추상 클래스
 *
 * 모든 엔티티가 공통으로 가져야 하는 필드들을 정의합니다.
 */
export abstract class BaseEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', comment: '생성 일시' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '수정 일시' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, comment: '삭제 일시' })
  deletedAt?: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '생성자 ID',
  })
  createdBy?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '수정자 ID',
  })
  updatedBy?: string;

  @VersionColumn({ comment: '버전' })
  version: number;

  /**
   * 엔티티를 DTO로 변환하는 추상 메서드
   * 각 엔티티에서 구현해야 합니다.
   */
  abstract DTO로_변환한다(): T;
}
