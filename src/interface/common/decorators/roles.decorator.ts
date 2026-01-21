import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * 특정 역할(role)을 가진 사용자만 접근할 수 있도록 제한하는 데코레이터
 * 
 * @example
 * ```typescript
 * @Roles('admin')
 * @Get('users')
 * async getUsers() { ... }
 * ```
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
