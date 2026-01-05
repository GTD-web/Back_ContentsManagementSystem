import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationManagement } from '@domain/sub/education-management/education-management.entity';
import type {
  EducationManagementDto,
  Attendee,
} from '@domain/sub/education-management/education-management.types';
import { AttendeeStatus } from '@domain/sub/education-management/attendee.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 교육 관리 비즈니스 서비스
 *
 * @description
 * - EducationManagement Entity와 EducationManagementDto 간의 변환을 담당합니다.
 * - 교육 관리 관련 비즈니스 로직을 처리합니다.
 * - 수강자 관리, 수강 상태 업데이트 등의 기능을 제공합니다.
 */
@Injectable()
export class EducationManagementService {
  constructor(
    @InjectRepository(EducationManagement)
    private readonly educationRepository: Repository<EducationManagement>,
  ) {}

  /**
   * 교육 목록을 조회한다
   */
  async 교육_목록을_조회_한다(
    filters?: Record<string, any>,
  ): Promise<ApiResponse<EducationManagementDto[]>> {
    const educations = await this.educationRepository.find({
      relations: ['manager'],
      order: {
        deadline: 'ASC',
      },
      where: filters,
    });

    const educationDtos = educations.map((education) =>
      education.DTO로_변환한다(),
    );

    return successResponse(
      educationDtos,
      '교육 목록을 성공적으로 조회했습니다.',
    );
  }

  /**
   * 교육 상세 정보를 조회한다
   */
  async 교육을_조회_한다(
    educationId: string,
  ): Promise<ApiResponse<EducationManagementDto>> {
    const education = await this.educationRepository.findOne({
      where: { id: educationId },
      relations: ['manager'],
    });

    if (!education) {
      throw new Error(`교육을 찾을 수 없습니다. ID: ${educationId}`);
    }

    return successResponse(
      education.DTO로_변환한다(),
      '교육 정보를 성공적으로 조회했습니다.',
    );
  }

  /**
   * 교육을 생성한다
   */
  async 교육을_생성_한다(
    data: Partial<EducationManagementDto>,
  ): Promise<ApiResponse<EducationManagementDto>> {
    const education = this.educationRepository.create(data as any);
    const savedEducation = await this.educationRepository.save(education);
    
    const result = Array.isArray(savedEducation) ? savedEducation[0] : savedEducation;

    return successResponse(
      result.DTO로_변환한다(),
      '교육이 성공적으로 생성되었습니다.',
    );
  }

  /**
   * 교육을 수정한다
   */
  async 교육을_수정_한다(
    educationId: string,
    data: Partial<EducationManagementDto>,
  ): Promise<ApiResponse<EducationManagementDto>> {
    const education = await this.educationRepository.findOne({
      where: { id: educationId },
      relations: ['manager'],
    });

    if (!education) {
      throw new Error(`교육을 찾을 수 없습니다. ID: ${educationId}`);
    }

    Object.assign(education, data);
    const updatedEducation = await this.educationRepository.save(education);

    return successResponse(
      updatedEducation.DTO로_변환한다(),
      '교육이 성공적으로 수정되었습니다.',
    );
  }

  /**
   * 교육을 삭제한다 (Soft Delete)
   */
  async 교육을_삭제_한다(educationId: string): Promise<ApiResponse<void>> {
    const result = await this.educationRepository.softDelete(educationId);

    if (result.affected === 0) {
      throw new Error(`교육을 찾을 수 없습니다. ID: ${educationId}`);
    }

    return successResponse(
      undefined as any,
      '교육이 성공적으로 삭제되었습니다.',
    );
  }

  /**
   * 수강자를 추가한다
   */
  async 수강자를_추가_한다(
    educationId: string,
    attendee: Attendee,
  ): Promise<ApiResponse<EducationManagementDto>> {
    const education = await this.educationRepository.findOne({
      where: { id: educationId },
      relations: ['manager'],
    });

    if (!education) {
      throw new Error(`교육을 찾을 수 없습니다. ID: ${educationId}`);
    }

    education.수강직원을_추가한다(attendee);
    const updatedEducation = await this.educationRepository.save(education);

    return successResponse(
      updatedEducation.DTO로_변환한다(),
      '수강자가 성공적으로 추가되었습니다.',
    );
  }

  /**
   * 수강자의 수강 상태를 업데이트한다
   */
  async 수강_상태를_업데이트_한다(
    educationId: string,
    attendeeId: string,
    status: string,
  ): Promise<ApiResponse<Attendee>> {
    const education = await this.educationRepository.findOne({
      where: { id: educationId },
      relations: ['manager'],
    });

    if (!education) {
      throw new Error(`교육을 찾을 수 없습니다. ID: ${educationId}`);
    }

    education.수강직원_상태를_변경한다(attendeeId, status as AttendeeStatus);
    const updatedEducation = await this.educationRepository.save(education);

    const attendee = updatedEducation.attendees.find(
      (a) => a.id === attendeeId,
    );
    if (!attendee) {
      throw new Error(`수강자를 찾을 수 없습니다. ID: ${attendeeId}`);
    }

    return successResponse(attendee, '수강 상태가 성공적으로 업데이트되었습니다.');
  }

  /**
   * 수강자를 추가한다
   */
  async 수강_직원을_추가_한다(
    educationId: string,
    employeeId: string,
    deadline: Date,
  ): Promise<ApiResponse<Attendee>> {
    const education = await this.educationRepository.findOne({
      where: { id: educationId },
      relations: ['manager'],
    });

    if (!education) {
      throw new Error(`교육을 찾을 수 없습니다. ID: ${educationId}`);
    }

    const attendee: Attendee = {
      id: employeeId,
      name: 'Employee Name', // TODO: Fetch from EmployeeService
      status: AttendeeStatus.PENDING,
      deadline: deadline,
    };

    education.수강직원을_추가한다(attendee);
    const updatedEducation = await this.educationRepository.save(education);

    const addedAttendee = updatedEducation.attendees.find(
      (a) => a.id === employeeId,
    );

    return successResponse(
      addedAttendee!,
      '수강자가 성공적으로 추가되었습니다.',
    );
  }

  /**
   * 수강 직원 목록을 조회한다
   */
  async 수강_직원_목록을_조회_한다(
    educationId: string,
  ): Promise<ApiResponse<Attendee[]>> {
    const education = await this.educationRepository.findOne({
      where: { id: educationId },
    });

    if (!education) {
      throw new Error(`교육을 찾을 수 없습니다. ID: ${educationId}`);
    }

    return successResponse(
      education.attendees,
      '수강 직원 목록을 성공적으로 조회했습니다.',
    );
  }
}
