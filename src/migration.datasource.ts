import { DataSource } from 'typeorm';
import { config } from 'dotenv';

/**
 * TypeORM CLI 마이그레이션용 DataSource 설정
 *
 * 사용 예시:
 * - npm run migration:generate -- migrations/InitialMigration
 * - npm run migration:run
 * - npm run migration:revert
 *
 * 주의:
 * - 개발 환경(NODE_ENV=development)에서는 database.module.ts의 synchronize: true 사용
 * - dev/prod 환경에서만 마이그레이션 사용
 */

// .env 파일 로드
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5434'),
  username: process.env.DATABASE_USERNAME || 'lumir_admin',
  password: process.env.DATABASE_PASSWORD || 'lumir_password_2024',
  database: process.env.DATABASE_NAME || 'lumir_cms',
  entities: ['src/**/*.entity.ts'],
  migrations: ['migrations/*.ts'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: false, // 마이그레이션 사용 시 항상 false
  logging: process.env.DB_LOGGING === 'true',
});
