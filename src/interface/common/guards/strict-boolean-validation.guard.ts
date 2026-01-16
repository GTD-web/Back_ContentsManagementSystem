import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * 엄격한 boolean 타입 검증 가드
 * 메타데이터로 지정된 필드들이 boolean 타입인지 검증합니다.
 */
@Injectable()
export class StrictBooleanValidationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const fieldsToValidate = this.reflector.get<string[]>(
      'strictBooleanFields',
      context.getHandler(),
    );

    if (!fieldsToValidate || fieldsToValidate.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const body = request.body;

    if (body && typeof body === 'object') {
      for (const field of fieldsToValidate) {
        if (field in body && typeof body[field] !== 'boolean') {
          throw new BadRequestException(`${field} must be a boolean value`);
        }
      }
    }

    return true;
  }
}
