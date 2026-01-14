import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { CompanyContextService } from './company-context.service';
import {
  GetOrganizationInfoHandler,
  GetDepartmentListHandler,
  GetRankListHandler,
  GetPositionListHandler,
} from './handlers';

const QueryHandlers = [
  GetOrganizationInfoHandler,
  GetDepartmentListHandler,
  GetRankListHandler,
  GetPositionListHandler,
];

/**
 * 조직 컨텍스트 모듈
 *
 * SSO 서버로부터 조직, 부서, 직급, 직책 정보를 조회합니다.
 */
@Module({
  imports: [CqrsModule, HttpModule, ConfigModule],
  providers: [CompanyContextService, ...QueryHandlers],
  exports: [CompanyContextService],
})
export class CompanyContextModule {}
