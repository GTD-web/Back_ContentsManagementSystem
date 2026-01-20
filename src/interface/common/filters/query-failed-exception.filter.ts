import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 * TypeORM QueryFailedError를 처리하는 전역 Exception Filter
 * 
 * - UUID 형식 오류: 400 Bad Request
 * - 기타 DB 에러: 500 Internal Server Error
 */
@Catch(QueryFailedError)
export class QueryFailedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(QueryFailedExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // PostgreSQL 에러 코드
    const driverError = (exception as any).driverError;
    const errorCode = driverError?.code;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database query failed';
    let error = 'Internal Server Error';

    // UUID 형식 오류 처리 (PostgreSQL error code: 22P02)
    if (errorCode === '22P02' && driverError?.message?.includes('uuid')) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid UUID format';
      error = 'Bad Request';

      this.logger.warn(
        `Invalid UUID format in request to ${request.method} ${request.url}`,
      );
    } else {
      // 기타 DB 에러는 로그만 남기고 일반적인 에러 메시지 반환
      this.logger.error(
        `Database error: ${exception.message}`,
        exception.stack,
      );
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
