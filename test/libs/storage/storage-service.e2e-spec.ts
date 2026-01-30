import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { STORAGE_SERVICE, StorageModule } from '../../../libs/storage/storage.module';
import { IStorageService } from '../../../libs/storage/interfaces/storage.interface';
import { LocalStorageService } from '../../../libs/storage/local-storage.service';
import { S3Service } from '../../../libs/storage/s3.service';
import { join } from 'path';

/**
 * Storage Service 통합 테스트
 * 
 * 환경에 따라 올바른 Storage Service가 주입되는지 검증합니다.
 * 
 * 주의:
 * - 이 테스트는 Factory Pattern과 인터페이스 준수 여부만 검증합니다
 * - 실제 파일 업로드 테스트는 각 도메인의 E2E 테스트에서 수행합니다
 *   (예: test/interface/admin/ir/post-ir-with-files.e2e-spec.ts)
 */
describe('[Integration] Storage Service', () => {
  describe('Factory Pattern - Service Selection', () => {
    it('NODE_ENV=test 일 때 LocalStorageService가 주입되어야 한다', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [
              () => ({
                NODE_ENV: 'test',
                LOCAL_UPLOAD_DIR: join(process.cwd(), 'uploads'),
                PORT: 4001,
              }),
            ],
          }),
          StorageModule,
        ],
      }).compile();

      const storageService = module.get<IStorageService>(STORAGE_SERVICE);
      expect(storageService).toBeDefined();
      expect(storageService).toBeInstanceOf(LocalStorageService);

      await module.close();
    });

    it('NODE_ENV=development 일 때 LocalStorageService가 주입되어야 한다', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [
              () => ({
                NODE_ENV: 'development',
                LOCAL_UPLOAD_DIR: join(process.cwd(), 'uploads'),
                PORT: 4001,
              }),
            ],
          }),
          StorageModule,
        ],
      }).compile();

      const storageService = module.get<IStorageService>(STORAGE_SERVICE);
      expect(storageService).toBeDefined();
      expect(storageService).toBeInstanceOf(LocalStorageService);

      await module.close();
    });

    it('NODE_ENV=staging 일 때 S3Service가 주입되어야 한다', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [
              () => ({
                NODE_ENV: 'staging',
                AWS_REGION: 'ap-northeast-2',
                AWS_S3_BUCKET: 'test-bucket',
                AWS_ACCESS_KEY_ID: 'test-key',
                AWS_SECRET_ACCESS_KEY: 'test-secret',
              }),
            ],
          }),
          StorageModule,
        ],
      }).compile();

      const storageService = module.get<IStorageService>(STORAGE_SERVICE);
      expect(storageService).toBeDefined();
      expect(storageService).toBeInstanceOf(S3Service);

      await module.close();
    });

    it('NODE_ENV=production 일 때 S3Service가 주입되어야 한다', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [
              () => ({
                NODE_ENV: 'production',
                AWS_REGION: 'ap-northeast-2',
                AWS_S3_BUCKET: 'test-bucket',
                AWS_ACCESS_KEY_ID: 'test-key',
                AWS_SECRET_ACCESS_KEY: 'test-secret',
              }),
            ],
          }),
          StorageModule,
        ],
      }).compile();

      const storageService = module.get<IStorageService>(STORAGE_SERVICE);
      expect(storageService).toBeDefined();
      expect(storageService).toBeInstanceOf(S3Service);

      await module.close();
    });

    it('NODE_ENV=test이고 USE_REAL_S3_IN_TEST=true 일 때 S3Service가 주입되어야 한다', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [
              () => ({
                NODE_ENV: 'test',
                USE_REAL_S3_IN_TEST: 'true',
                AWS_REGION: 'ap-northeast-2',
                AWS_S3_BUCKET: 'test-bucket',
                AWS_ACCESS_KEY_ID: 'test-key',
                AWS_SECRET_ACCESS_KEY: 'test-secret',
              }),
            ],
          }),
          StorageModule,
        ],
      }).compile();

      const storageService = module.get<IStorageService>(STORAGE_SERVICE);
      expect(storageService).toBeDefined();
      expect(storageService).toBeInstanceOf(S3Service);

      await module.close();
    });

    it('NODE_ENV이 설정되지 않으면 기본값으로 LocalStorageService가 주입되어야 한다', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
            load: [
              () => ({
                // NODE_ENV 미설정
                PORT: 4001,
              }),
            ],
          }),
          StorageModule,
        ],
      }).compile();

      const storageService = module.get<IStorageService>(STORAGE_SERVICE);
      expect(storageService).toBeDefined();
      expect(storageService).toBeInstanceOf(LocalStorageService);

      await module.close();
    });
  });

  describe('Interface Compliance', () => {
    it('LocalStorageService는 IStorageService 인터페이스를 구현해야 한다', () => {
      const configService = new ConfigService({
        NODE_ENV: 'test',
        LOCAL_UPLOAD_DIR: join(process.cwd(), 'uploads'),
        PORT: 4001,
      });
      const service = new LocalStorageService(configService);
      
      expect(service.uploadFile).toBeDefined();
      expect(service.uploadFiles).toBeDefined();
      expect(service.deleteFile).toBeDefined();
      expect(service.deleteFiles).toBeDefined();
      expect(typeof service.uploadFile).toBe('function');
      expect(typeof service.uploadFiles).toBe('function');
      expect(typeof service.deleteFile).toBe('function');
      expect(typeof service.deleteFiles).toBe('function');
    });

    it('S3Service는 IStorageService 인터페이스를 구현해야 한다', () => {
      const configService = new ConfigService({
        NODE_ENV: 'production',
        AWS_REGION: 'ap-northeast-2',
        AWS_S3_BUCKET: 'test-bucket',
        AWS_ACCESS_KEY_ID: 'test-key',
        AWS_SECRET_ACCESS_KEY: 'test-secret',
      });
      const service = new S3Service(configService);
      
      expect(service.uploadFile).toBeDefined();
      expect(service.uploadFiles).toBeDefined();
      expect(service.deleteFile).toBeDefined();
      expect(service.deleteFiles).toBeDefined();
      expect(typeof service.uploadFile).toBe('function');
      expect(typeof service.uploadFiles).toBe('function');
      expect(typeof service.deleteFile).toBe('function');
      expect(typeof service.deleteFiles).toBe('function');
    });
  });
});
