import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@libs/database/base/base.entity';

/**
 * Admin Entity (관리자 허용 목록)
 *
 * CMS 백엔드 API 접근이 허용된 사번 목록을 관리합니다.
 */
@Entity('admins')
@Index('idx_admin_employee_number', ['employeeNumber'], { unique: true })
@Index('idx_admin_is_active', ['isActive'])
export class Admin extends BaseEntity<Admin> {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '사번 (SSO에서 받은 employeeNumber)',
  })
  employeeNumber: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: '관리자 이름',
  })
  name: string | null;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: '관리자 이메일',
  })
  email: string | null;

  @Column({
    type: 'boolean',
    default: true,
    comment: '활성화 여부',
  })
  isActive: boolean;

  @Column({
    type: 'text',
    nullable: true,
    comment: '비고',
  })
  notes: string | null;

  /**
   * 엔티티를 DTO로 변환한다
   */
  DTO로_변환한다(): Admin {
    return this;
  }
}
