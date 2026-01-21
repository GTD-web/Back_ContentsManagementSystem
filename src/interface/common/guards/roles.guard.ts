import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * 역할(Role) 기반 접근 제어 가드
 *
 * @Roles() 데코레이터로 지정된 역할을 가진 사용자만 접근할 수 있도록 제한합니다.
 * 사용자가 요구되는 역할 중 하나라도 가지고 있으면 접근을 허용합니다.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // @Roles() 데코레이터에서 필요한 역할 목록 가져오기
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 역할이 지정되지 않았으면 접근 허용
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request['user'];

    // 사용자 정보가 없으면 접근 거부 (JwtAuthGuard를 먼저 적용해야 함)
    if (!user) {
      this.logger.warn('사용자 정보가 없습니다. JwtAuthGuard를 먼저 적용해주세요.');
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    // 사용자가 필요한 역할 중 하나라도 가지고 있는지 확인
    const userRoles = user.roles || [];
    const hasRole = requiredRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      this.logger.warn(
        `권한 부족: 사용자 ${user.email}는 ${requiredRoles.join(', ')} 역할이 필요하지만 ${userRoles.join(', ')} 역할만 가지고 있습니다.`,
      );
      throw new ForbiddenException(
        `이 작업을 수행하려면 ${requiredRoles.join(' 또는 ')} 권한이 필요합니다.`,
      );
    }

    return true;
  }
}
