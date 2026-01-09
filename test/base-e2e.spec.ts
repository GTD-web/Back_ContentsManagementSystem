import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import request from 'supertest';

/**
 * E2E 테스트 베이스 클래스
 * 모든 E2E 테스트에서 상속받아 사용
 */
export class BaseE2ETest {
  public app: INestApplication;
  protected dataSource: DataSource;

  /**
   * supertest request 반환
   * 사용법: testSuite.request().get('/api/endpoint')
   */
  request() {
    return {
      get: (url: string) => request(this.app.getHttpServer()).get(url),
      post: (url: string) => request(this.app.getHttpServer()).post(url),
      put: (url: string) => request(this.app.getHttpServer()).put(url),
      patch: (url: string) => request(this.app.getHttpServer()).patch(url),
      delete: (url: string) => request(this.app.getHttpServer()).delete(url),
    };
  }

  /**
   * Repository 접근을 위한 public 메서드
   */
  getRepository(entityName: string) {
    return this.dataSource.getRepository(entityName);
  }

  /**
   * 테스트 애플리케이션 초기화
   */
  async initializeApp(): Promise<void> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();

    // Global Prefix 설정
    this.app.setGlobalPrefix('api');

    // ValidationPipe 설정 (실제 애플리케이션과 동일하게)
    this.app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    // CORS 설정
    this.app.enableCors({
      origin: '*',
      methods: '*',
      allowedHeaders: '*',
      exposedHeaders: '*',
      credentials: false,
    });

    this.dataSource = moduleFixture.get<DataSource>(DataSource);

    // 테스트 환경에서 데이터베이스 스키마 동기화
    await this.dataSource.synchronize(true);

    await this.app.init();
  }

  /**
   * 테스트 애플리케이션 종료
   */
  async closeApp(): Promise<void> {
    if (this.app) {
      await this.app.close();
    }
  }

  /**
   * 모든 테이블 데이터 초기화 (TRUNCATE)
   */
  private async cleanDatabase(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      return;
    }

    const entities = this.dataSource.entityMetadatas;

    // PostgreSQL의 경우 CASCADE를 사용하여 외래키 제약조건 무시
    try {
      // 모든 테이블 TRUNCATE
      for (const entity of entities) {
        const tableName = entity.tableName;
        await this.dataSource.query(
          `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`,
        );
      }
    } catch (error) {
      console.warn('테이블 정리 중 오류 발생:', error);
      // 실패 시 개별 테이블 삭제 시도
      for (const entity of entities) {
        try {
          const repository = this.dataSource.getRepository(entity.name);
          await repository.clear();
        } catch (e) {
          console.warn(`테이블 ${entity.name} 정리 실패:`, e);
        }
      }
    }
  }

  /**
   * 특정 테이블들만 초기화
   */
  private async cleanTables(tableNames: string[]): Promise<void> {
    if (!this.dataSource.isInitialized) {
      return;
    }

    try {
      for (const tableName of tableNames) {
        await this.dataSource.query(
          `TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`,
        );
      }
    } catch (error) {
      console.warn('특정 테이블 정리 중 오류 발생:', error);
    }
  }

  /**
   * 각 테스트 전 데이터베이스 정리
   */
  async cleanupBeforeTest(): Promise<void> {
    await this.cleanDatabase();
  }

  /**
   * 각 테스트 후 데이터베이스 정리
   */
  async cleanupAfterTest(): Promise<void> {
    await this.cleanDatabase();
  }

  /**
   * 특정 테이블들만 정리
   */
  async cleanupSpecificTables(tableNames: string[]): Promise<void> {
    await this.cleanTables(tableNames);
  }

  /**
   * 테스트 스위트 시작 전 초기화
   */
  async beforeAll(): Promise<void> {
    await this.initializeApp();
  }

  /**
   * 테스트 스위트 종료 후 정리
   */
  async afterAll(): Promise<void> {
    await this.closeApp();
  }
}
