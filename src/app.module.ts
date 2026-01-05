import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AnnouncementPopupInterfaceModule } from '@interface/announcement-popup';

/**
 * 루미르 CMS 애플리케이션 모듈
 */
@Module({
  imports: [
    // 환경 변수 설정
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 데이터베이스 연결
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'lumir_cms',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production', // 프로덕션에서는 false로 설정
      logging: process.env.NODE_ENV === 'development',
    }),

    // Interface Layer Modules
    AnnouncementPopupInterfaceModule,
  ],
})
export class AppModule {}
