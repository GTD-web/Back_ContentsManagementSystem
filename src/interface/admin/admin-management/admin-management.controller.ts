import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AdminService } from '@domain/common/admin/admin.service';
import {
  CreateAdminDto,
  AdminResponseDto,
  UpdateAdminStatusDto,
} from '@interface/common/dto/admin';

/**
 * 관리자 관리 컨트롤러
 *
 * Admin 테이블의 CRUD 기능을 제공합니다.
 * 전역 가드(JwtAuthGuard, AdminGuard)가 자동으로 적용됩니다.
 */
@ApiTags('공통. 관리자 관리')
@Controller('admin/management/admins')
@ApiBearerAuth('Bearer')
export class AdminManagementController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * 모든 관리자 목록을 조회합니다
   */
  @Get()
  @ApiOperation({
    summary: '관리자 목록 조회',
    description: 'Admin 테이블에 등록된 모든 관리자를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '조회 성공',
    type: [AdminResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않음',
  })
  @ApiResponse({
    status: 403,
    description: '관리자 권한 없음',
  })
  async getAllAdmins(): Promise<AdminResponseDto[]> {
    return await this.adminService.모든_관리자를_조회한다();
  }

  /**
   * 새로운 관리자를 추가합니다
   */
  @Post()
  @ApiOperation({
    summary: '관리자 추가',
    description: 'Admin 테이블에 새로운 관리자를 추가합니다.',
  })
  @ApiResponse({
    status: 201,
    description: '추가 성공',
    type: AdminResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않음',
  })
  @ApiResponse({
    status: 403,
    description: '관리자 권한 없음',
  })
  async createAdmin(@Body() dto: CreateAdminDto): Promise<AdminResponseDto> {
    return await this.adminService.관리자를_생성한다(
      dto.employeeNumber,
      dto.name,
      dto.email,
      dto.notes,
    );
  }

  /**
   * 관리자의 활성화 상태를 변경합니다
   */
  @Patch(':id/status')
  @ApiOperation({
    summary: '관리자 활성화 상태 변경',
    description: '관리자의 활성화/비활성화 상태를 변경합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '변경 성공',
    type: AdminResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않음',
  })
  @ApiResponse({
    status: 403,
    description: '관리자 권한 없음',
  })
  @ApiResponse({
    status: 404,
    description: '관리자를 찾을 수 없음',
  })
  async updateAdminStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAdminStatusDto,
  ): Promise<AdminResponseDto> {
    return await this.adminService.활성화_상태를_변경한다(id, dto.isActive);
  }

  /**
   * 관리자를 삭제합니다 (소프트 삭제)
   */
  @Delete(':id')
  @ApiOperation({
    summary: '관리자 삭제',
    description: '관리자를 삭제합니다. (소프트 삭제)',
  })
  @ApiResponse({
    status: 200,
    description: '삭제 성공',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않음',
  })
  @ApiResponse({
    status: 403,
    description: '관리자 권한 없음',
  })
  @ApiResponse({
    status: 404,
    description: '관리자를 찾을 수 없음',
  })
  async deleteAdmin(@Param('id') id: string): Promise<void> {
    await this.adminService.관리자를_삭제한다(id);
  }
}
