/**
 * 조직 하이라키 조회 쿼리
 */
export class GetOrganizationHierarchyQuery {
  constructor(public readonly includeEmployees: boolean = true) {}
}
