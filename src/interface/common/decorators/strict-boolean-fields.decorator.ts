import { SetMetadata } from '@nestjs/common';

/**
 * 엄격한 boolean 검증이 필요한 필드를 지정하는 데코레이터
 */
export const StrictBooleanFields = (...fields: string[]) =>
  SetMetadata('strictBooleanFields', fields);
