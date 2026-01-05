import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShareholdersMeeting } from '@domain/core/shareholders-meeting/shareholders-meeting.entity';
import type { ShareholdersMeetingDto } from '@domain/core/shareholders-meeting/shareholders-meeting.types';
import {
  successResponse,
  type ApiResponse,
} from '@domain/common/types/api-response.types';

/**
 * 주주총회 비즈니스 서비스
 *
 * @description
 * - ShareholdersMeeting Entity와 ShareholdersMeetingDto 간의 변환을 담당합니다.
 * - 주주총회 관련 비즈니스 로직을 처리합니다.
 * - 의결 결과 관리, 안건 관리 등의 기능을 제공합니다.
 */
@Injectable()
export class ShareholdersMeetingService {
  constructor(
    @InjectRepository(ShareholdersMeeting)
    private readonly meetingRepository: Repository<ShareholdersMeeting>,
  ) {}

  /**
   * 주주총회 목록을 조회한다
   */
  async 주주총회_목록을_조회_한다(
    code?: string,
  ): Promise<ApiResponse<ShareholdersMeetingDto[]>> {
    const queryBuilder = this.meetingRepository
      .createQueryBuilder('meeting')
      .leftJoinAndSelect('meeting.manager', 'manager')
      .orderBy('meeting.meetingDate', 'DESC');

    // code 필터 추가 (필요시)
    if (code) {
      queryBuilder.andWhere('meeting.category->>code = :code', { code });
    }

    const meetings = await queryBuilder.getMany();
    const meetingDtos = meetings.map((meeting) => meeting.DTO로_변환한다());

    return successResponse(
      meetingDtos,
      '주주총회 목록을 성공적으로 조회했습니다.',
    );
  }

  /**
   * 주주총회 상세 정보를 조회한다
   */
  async 주주총회를_조회_한다(
    meetingId: string,
  ): Promise<ApiResponse<ShareholdersMeetingDto>> {
    const meeting = await this.meetingRepository.findOne({
      where: { id: meetingId },
      relations: ['manager'],
    });

    if (!meeting) {
      throw new Error(`주주총회를 찾을 수 없습니다. ID: ${meetingId}`);
    }

    return successResponse(
      meeting.DTO로_변환한다(),
      '주주총회 정보를 성공적으로 조회했습니다.',
    );
  }

  /**
   * 주주총회를 생성한다
   */
  async 주주총회를_생성_한다(
    data: Partial<ShareholdersMeetingDto>,
  ): Promise<ApiResponse<ShareholdersMeetingDto>> {
    const meeting = this.meetingRepository.create(data as any);
    const savedMeeting = await this.meetingRepository.save(meeting);
    
    const result = Array.isArray(savedMeeting) ? savedMeeting[0] : savedMeeting;

    return successResponse(
      result.DTO로_변환한다(),
      '주주총회가 성공적으로 생성되었습니다.',
    );
  }

  /**
   * 주주총회를 수정한다
   */
  async 주주총회를_수정_한다(
    meetingId: string,
    data: Partial<ShareholdersMeetingDto>,
  ): Promise<ApiResponse<ShareholdersMeetingDto>> {
    const meeting = await this.meetingRepository.findOne({
      where: { id: meetingId },
      relations: ['manager'],
    });

    if (!meeting) {
      throw new Error(`주주총회를 찾을 수 없습니다. ID: ${meetingId}`);
    }

    Object.assign(meeting, data);
    const updatedMeeting = await this.meetingRepository.save(meeting);

    return successResponse(
      updatedMeeting.DTO로_변환한다(),
      '주주총회가 성공적으로 수정되었습니다.',
    );
  }

  /**
   * 주주총회를 삭제한다 (Soft Delete)
   */
  async 주주총회를_삭제_한다(meetingId: string): Promise<ApiResponse<void>> {
    const result = await this.meetingRepository.softDelete(meetingId);

    if (result.affected === 0) {
      throw new Error(`주주총회를 찾을 수 없습니다. ID: ${meetingId}`);
    }

    return successResponse(
      undefined as any,
      '주주총회가 성공적으로 삭제되었습니다.',
    );
  }

  /**
   * 주주총회를 공개한다
   */
  async 주주총회를_공개_한다(
    meetingId: string,
  ): Promise<ApiResponse<ShareholdersMeetingDto>> {
    const meeting = await this.meetingRepository.findOne({
      where: { id: meetingId },
      relations: ['manager'],
    });

    if (!meeting) {
      throw new Error(`주주총회를 찾을 수 없습니다. ID: ${meetingId}`);
    }

    meeting.공개한다();
    const updatedMeeting = await this.meetingRepository.save(meeting);

    return successResponse(
      updatedMeeting.DTO로_변환한다(),
      '주주총회가 성공적으로 공개되었습니다.',
    );
  }

  /**
   * 주주총회를 비공개한다
   */
  async 주주총회를_비공개_한다(
    meetingId: string,
  ): Promise<ApiResponse<ShareholdersMeetingDto>> {
    const meeting = await this.meetingRepository.findOne({
      where: { id: meetingId },
      relations: ['manager'],
    });

    if (!meeting) {
      throw new Error(`주주총회를 찾을 수 없습니다. ID: ${meetingId}`);
    }

    meeting.비공개한다();
    const updatedMeeting = await this.meetingRepository.save(meeting);

    return successResponse(
      updatedMeeting.DTO로_변환한다(),
      '주주총회가 성공적으로 비공개되었습니다.',
    );
  }
}
