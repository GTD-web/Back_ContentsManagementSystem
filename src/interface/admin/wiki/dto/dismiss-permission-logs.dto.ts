import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class DismissPermissionLogsDto {
  @ApiProperty({
    description: '무시할 권한 로그 ID 목록',
    type: [String],
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
  })
  @IsArray()
  @ArrayNotEmpty({ message: '최소 1개 이상의 로그 ID가 필요합니다.' })
  @IsUUID('4', { each: true, message: '유효한 UUID 형식이어야 합니다.' })
  logIds: string[];
}
