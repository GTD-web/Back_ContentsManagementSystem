import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

/**
 * Admin 도메인 서비스
 *
 * Admin 엔티티의 비즈니스 로직을 담당합니다.
 */
@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  /**
   * 사번으로 관리자를 조회한다
   */
  async 사번으로_조회한다(employeeNumber: string): Promise<Admin | null> {
    return await this.adminRepository.findOne({
      where: { employeeNumber, isActive: true },
    });
  }

  /**
   * 사번이 관리자 목록에 있는지 확인한다
   */
  async 관리자인지_확인한다(employeeNumber: string): Promise<boolean> {
    const admin = await this.사번으로_조회한다(employeeNumber);
    return admin !== null;
  }

  /**
   * 모든 관리자를 조회한다
   */
  async 모든_관리자를_조회한다(): Promise<Admin[]> {
    return await this.adminRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 관리자를 생성한다
   */
  async 관리자를_생성한다(
    employeeNumber: string,
    name?: string,
    email?: string,
    notes?: string,
  ): Promise<Admin> {
    const admin = this.adminRepository.create({
      employeeNumber,
      name: name || null,
      email: email || null,
      notes: notes || null,
      isActive: true,
    });

    const savedAdmin = await this.adminRepository.save(admin);
    this.logger.log(`관리자가 추가되었습니다: ${employeeNumber}`);

    return savedAdmin;
  }

  /**
   * 관리자를 삭제한다 (소프트 삭제)
   */
  async 관리자를_삭제한다(id: string): Promise<void> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException(`관리자를 찾을 수 없습니다: ${id}`);
    }

    await this.adminRepository.softDelete(id);
    this.logger.log(`관리자가 삭제되었습니다: ${admin.employeeNumber}`);
  }

  /**
   * 관리자 활성화 상태를 변경한다
   */
  async 활성화_상태를_변경한다(id: string, isActive: boolean): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException(`관리자를 찾을 수 없습니다: ${id}`);
    }

    admin.isActive = isActive;
    const updatedAdmin = await this.adminRepository.save(admin);

    this.logger.log(
      `관리자 활성화 상태가 변경되었습니다: ${admin.employeeNumber} -> ${isActive}`,
    );

    return updatedAdmin;
  }
}
