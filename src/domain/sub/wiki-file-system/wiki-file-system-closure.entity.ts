import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  PrimaryColumn,
  Index,
} from 'typeorm';
import { WikiFileSystem } from './wiki-file-system.entity';

/**
 * WikiFileSystemClosure Entity (위키 파일 시스템 Closure Table)
 * 
 * 조상-자손 관계를 미리 저장하여 계층 구조 조회 성능 최적화
 * - 재귀 쿼리 불필요
 * - 트리거 자동화로 유지 관리
 * 
 * ⚠️ Soft Delete 없음: Closure Table은 계산된 데이터
 */
@Entity('wiki_file_system_closures')
@Index('idx_wiki_closure_ancestor', ['ancestor'])
@Index('idx_wiki_closure_descendant', ['descendant'])
@Index('idx_wiki_closure_depth', ['depth'])
export class WikiFileSystemClosure {
  @PrimaryColumn('uuid', {
    comment: '조상 노드 ID',
  })
  ancestor: string;

  @ManyToOne(() => WikiFileSystem, (wiki) => wiki.ancestorClosures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ancestor' })
  ancestorNode: WikiFileSystem;

  @PrimaryColumn('uuid', {
    comment: '자손 노드 ID',
  })
  descendant: string;

  @ManyToOne(() => WikiFileSystem, (wiki) => wiki.descendantClosures, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'descendant' })
  descendantNode: WikiFileSystem;

  @Column({
    type: 'int',
    comment: '거리 (0=자기자신, 1=직접자식, 2=손자...)',
  })
  depth: number;

  @CreateDateColumn({
    type: 'timestamp',
    comment: '생성 일시',
  })
  createdAt: Date;

  // ⚠️ updatedAt, deletedAt, version 없음 (계산된 데이터, 재생성 가능)
}
