# 루미르 CMS 백엔드 - Infrastructure Layer 가이드

## 📋 목차
1. [데이터베이스 설정](#데이터베이스-설정)
2. [환경 변수 설정](#환경-변수-설정)
3. [서버 실행](#서버-실행)
4. [API 테스트](#api-테스트)
5. [마이그레이션](#마이그레이션)

---

## 데이터베이스 설정

### PostgreSQL 설치
```bash
# Windows (Chocolatey)
choco install postgresql

# macOS (Homebrew)
brew install postgresql@16

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql-16
```

### 데이터베이스 생성
```sql
-- PostgreSQL 접속
psql -U postgres

-- 데이터베이스 생성
CREATE DATABASE lumir_cms;

-- 사용자 생성 (선택사항)
CREATE USER lumir_admin WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE lumir_cms TO lumir_admin;
```

---

## 환경 변수 설정

### 1. `.env` 파일 생성
```bash
cp .env.example .env
```

### 2. `.env` 파일 수정
```env
# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=lumir_cms

# 애플리케이션 설정
NODE_ENV=development
PORT=3000
```

---

## 서버 실행

### 개발 모드 (Hot Reload)
```bash
npm run start:dev
```

### 프로덕션 빌드 후 실행
```bash
npm run build
npm run start:prod
```

### 서버 확인
- **API 엔드포인트**: http://localhost:3000/api
- **Swagger 문서**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/api/health (구현 필요)

---

## API 테스트

### Swagger UI 사용
1. 브라우저에서 http://localhost:3000/api-docs 접속
2. 각 API 엔드포인트 확인 및 테스트

### cURL 예시
```bash
# 공지사항 팝업 목록 조회
curl -X GET http://localhost:3000/api/announcement-popups

# 뉴스 생성
curl -X POST http://localhost:3000/api/news \
  -H "Content-Type: application/json" \
  -d '{
    "title": "테스트 뉴스",
    "code": "NEWS",
    "isPublic": true
  }'
```

---

## 마이그레이션

### 마이그레이션 스크립트 추가 (package.json)
```json
{
  "scripts": {
    "migration:generate": "typeorm migration:generate -d src/data-source.ts",
    "migration:run": "typeorm migration:run -d src/data-source.ts",
    "migration:revert": "typeorm migration:revert -d src/data-source.ts"
  }
}
```

### 마이그레이션 생성 및 실행
```bash
# 마이그레이션 생성
npm run migration:generate -- migrations/InitialSchema

# 마이그레이션 실행
npm run migration:run

# 마이그레이션 롤백
npm run migration:revert
```

### 주의사항
- **개발 환경**: `synchronize: true` (자동 스키마 동기화)
- **운영 환경**: `synchronize: false` (마이그레이션 필수)

---

## 트러블슈팅

### 1. 데이터베이스 연결 오류
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**해결**: PostgreSQL 서비스가 실행 중인지 확인
```bash
# Windows
net start postgresql-x64-16

# macOS/Linux
sudo systemctl start postgresql
```

### 2. 포트 충돌
```
Error: listen EADDRINUSE: address already in use :::3000
```
**해결**: `.env`에서 다른 포트 번호 지정
```env
PORT=3001
```

### 3. Entity 자동 로드 실패
**해결**: `app.module.ts`에서 `autoLoadEntities: true` 확인

---

## 다음 단계

1. ✅ 데이터베이스 연결
2. ✅ 서버 실행
3. ✅ Swagger 문서 확인
4. ⏳ JWT 인증/인가 구현
5. ⏳ AWS S3 파일 업로드
6. ⏳ Unit/E2E 테스트 작성

---

**작성일**: 2026-01-06
**버전**: v1.0
