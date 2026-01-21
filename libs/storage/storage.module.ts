import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Service } from './s3.service';
import { LocalStorageService } from './local-storage.service';
import type { IStorageService } from './interfaces/storage.interface';

/**
 * Storage Service Provider Token
 * 
 * 이 토큰을 사용하여 환경에 맞는 Storage Service를 주입받을 수 있습니다.
 */
export const STORAGE_SERVICE = 'STORAGE_SERVICE';

/**
 * Storage Module (Factory Pattern)
 * 
 * 환경 변수 NODE_ENV에 따라 적절한 Storage Service를 제공합니다.
 * - 'development', 'dev', 'test': LocalStorageService (로컬 저장)
 * - 'staging' 또는 'stage': S3Service (S3 저장, 경로 앞에 'stage/' 추가)
 * - 'production' 또는 'prod': S3Service (S3 저장, 경로 앞에 'prod/' 추가)
 * 
 * 테스트 환경에서 실제 S3를 사용하려면:
 * - USE_REAL_S3_IN_TEST=true 환경 변수 설정
 * - AWS 자격 증명 및 버킷 설정 필요
 */
@Module({
  imports: [ConfigModule],
  providers: [
    S3Service,
    LocalStorageService,
    {
      provide: STORAGE_SERVICE,
      useFactory: (
        configService: ConfigService,
        s3Service: S3Service,
        localStorageService: LocalStorageService,
      ): IStorageService => {
        const env = configService.get<string>('NODE_ENV', 'development');
        const useRealS3InTest = configService.get<string>('USE_REAL_S3_IN_TEST', 'false') === 'true';
        
        // 테스트 환경에서는 기본적으로 로컬 스토리지 사용
        // (단, USE_REAL_S3_IN_TEST=true일 경우 S3 사용)
        if (env === 'test' && !useRealS3InTest) {
          return localStorageService;
        }
        
        // development 또는 dev인 경우 로컬 스토리지 사용
        if (env === 'development' || env === 'dev') {
          return localStorageService;
        }
        
        // staging/stage 또는 production/prod인 경우 S3 사용
        return s3Service;
      },
      inject: [ConfigService, S3Service, LocalStorageService],
    },
  ],
  exports: [STORAGE_SERVICE, S3Service, LocalStorageService],
})
export class StorageModule {}
