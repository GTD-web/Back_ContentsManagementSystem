import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Prefix 설정
  app.setGlobalPrefix('api/admin');

  // Validation Pipe 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 속성 제거
      forbidNonWhitelisted: true, // DTO에 없는 속성 전달 시 에러
      transform: true, // 자동 타입 변환
    }),
  );

  // CORS 설정
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Admin Swagger 설정
  const adminConfig = new DocumentBuilder()
    .setTitle('루미르 CMS 관리자 API')
    .setDescription(
      '루미르 사내 컨텐츠 관리 시스템의 관리자용 RESTful API 문서입니다.',
    )
    .setVersion('1.0')
    .addTag('CMS 공통', '직원, 부서, 알림 등 공통 기능')
    .addTag('공지사항 팝업', '팝업 형태의 공지사항 관리')
    .addTag('공지사항', '사내 공지사항 관리')
    .addTag('뉴스', '회사 뉴스 관리')
    .addTag('브로슈어', '회사 홍보 브로슈어 관리')
    .addTag('IR', '투자자 관계 자료 관리')
    .addTag('주주총회', '주주총회 및 의결 결과 관리')
    .addTag('전자공시', '전자공시 문서 관리')
    .addTag('설문조사', '직원 설문조사 관리')
    .addTag('루미르 스토리', '회사 스토리 관리')
    .addTag('비디오 갤러리', '비디오 콘텐츠 관리')
    .addTag('교육 관리', '직원 교육 프로그램 관리')
    .addTag('위키', '사내 위키 문서 관리')
    .addBearerAuth() // JWT 인증 추가
    .build();

  const adminDocument = SwaggerModule.createDocument(app, adminConfig);
  SwaggerModule.setup('admin/api-docs', app, adminDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT || 4001;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 Admin API documentation: http://localhost:${port}/admin/api-docs`,
  );
  console.log(`🔧 Admin API base URL: http://localhost:${port}/api/admin`);
}

bootstrap();
