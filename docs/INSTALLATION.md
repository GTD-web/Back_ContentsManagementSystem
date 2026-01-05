# 패키지 설치 가이드

## 필수 패키지 설치

```bash
# Swagger 관련 패키지
npm install --save @nestjs/swagger swagger-ui-express

# Class Validator 및 Transformer
npm install --save class-validator class-transformer

# PostgreSQL 드라이버
npm install --save pg

# 환경 변수 관리
npm install --save @nestjs/config

# 이미 설치된 패키지
# - @nestjs/common
# - @nestjs/core
# - @nestjs/typeorm
# - typeorm
```

## 설치 명령어 (한 번에 실행)

```bash
npm install --save @nestjs/swagger swagger-ui-express class-validator class-transformer pg @nestjs/config
```

## 개발 환경 설정

1. `.env` 파일 생성:
```bash
cp .env.example .env
```

2. 데이터베이스 설정 (PostgreSQL)
```bash
# Docker로 PostgreSQL 실행 (선택사항)
docker run --name lumir-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=lumir_cms \
  -p 5432:5432 \
  -d postgres:16
```

3. 개발 서버 실행:
```bash
npm run start:dev
```

4. API 문서 확인:
```
http://localhost:3000/api-docs
```
