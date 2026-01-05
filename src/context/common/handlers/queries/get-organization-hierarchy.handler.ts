import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrganizationHierarchyQuery } from '../../queries/get-organization-hierarchy.query';
import { OrganizationService } from '@business/common/organization.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { OrganizationHierarchyDto } from '@domain/common/organization/organization.types';

/**
 * 조직 하이라키 조회 쿼리 핸들러
 */
@QueryHandler(GetOrganizationHierarchyQuery)
export class GetOrganizationHierarchyHandler
  implements IQueryHandler<GetOrganizationHierarchyQuery>
{
  constructor(
    private readonly organizationService: OrganizationService,
  ) {}

  async execute(
    query: GetOrganizationHierarchyQuery,
  ): Promise<ApiResponse<OrganizationHierarchyDto>> {
    return this.organizationService.조직_하이라키를_조회_한다({
      includeEmployees: query.includeEmployees,
    });
  }
}
