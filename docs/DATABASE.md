# 데이터베이스 관리 가이드

## 개요

이 프로젝트는 환경에 따라 다른 데이터베이스 관리 전략을 사용합니다:

- **개발 환경 (development)**: TypeORM Auto Synchronize
- **스테이징/프로덕션 (dev/prod)**: TypeORM Migrations

## 환경별 설정

### 개발 환경 (Local)

**파일**: `libs/database/database.module.ts`

```typescript
synchronize: isDevelopment ? true : false
```

**특징**:
- 엔티티 변경 시 자동으로 데이터베이스 스키마 업데이트
- 빠른 개발 속도
- 데이터 손실 가능성 있음 (운영 환경 사용 금지)

**환경 변수**:
```env
NODE_ENV=development
DB_SYNCHRONIZE=true
DATABASE_HOST=localhost
DATABASE_PORT=5434
DATABASE_USERNAME=lumir_admin
DATABASE_PASSWORD=lumir_password_2024
DATABASE_NAME=lumir_cms
```

### 스테이징/프로덕션 환경

**파일**: `src/migration.datasource.ts` (마이그레이션 CLI 전용)

**특징**:
- 명시적인 마이그레이션으로 스키마 변경 관리
- 버전 관리 가능
- 롤백 지원
- 데이터 안전성 보장

**환경 변수**:
```env
NODE_ENV=production  # 또는 staging
DB_SYNCHRONIZE=false
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
DATABASE_NAME=lumir_cms
```

## 마이그레이션 사용법

### 1. 마이그레이션 생성

엔티티를 수정한 후 마이그레이션 파일을 생성합니다:

```bash
npm run migration:generate -- migrations/YourMigrationName
```

예시:
```bash
npm run migration:generate -- migrations/AddUserTable
npm run migration:generate -- migrations/AddEmailToUser
```

### 2. 마이그레이션 실행

생성된 마이그레이션을 데이터베이스에 적용합니다:

```bash
npm run migration:run
```

### 3. 마이그레이션 되돌리기

마지막 마이그레이션을 롤백합니다:

```bash
npm run migration:revert
```

### 4. 마이그레이션 상태 확인

실행된 마이그레이션 목록을 확인합니다:

```bash
npm run migration:show
```

## 마이그레이션 파일 구조

```
migrations/
├── .gitkeep
├── 1704123456789-InitialMigration.ts
├── 1704234567890-AddUserTable.ts
└── 1704345678901-AddEmailToUser.ts
```

## 워크플로우

### 개발 환경에서의 워크플로우

1. 엔티티 파일 수정 (예: `src/domain/user/user.entity.ts`)
2. 애플리케이션 재시작 → 자동으로 스키마 업데이트
3. 개발 및 테스트

### 스테이징/프로덕션 배포 워크플로우

1. **개발 완료 후**:
   ```bash
   # synchronize를 false로 변경
   export DB_SYNCHRONIZE=false
   
   # 마이그레이션 생성
   npm run migration:generate -- migrations/YourFeatureName
   
   # 마이그레이션 파일 확인 및 검토
   git add migrations/
   git commit -m "feat: 새로운 기능을 위한 마이그레이션 추가"
   ```

2. **스테이징/프로덕션 서버에서**:
   ```bash
   # 코드 배포
   git pull origin main
   
   # 의존성 설치
   npm install
   
   # 마이그레이션 실행
   npm run migration:run
   
   # 애플리케이션 시작
   npm run start:prod
   ```

## 주의사항

### ⚠️ 중요

1. **절대 프로덕션에서 synchronize: true 사용 금지**
   - 데이터 손실 위험
   - 예기치 않은 스키마 변경

2. **마이그레이션 파일은 반드시 버전 관리에 포함**
   - Git에 커밋
   - 팀원 간 공유

3. **마이그레이션 실행 전 데이터베이스 백업**
   ```bash
   docker exec lumir-cms-postgres pg_dump -U lumir_admin lumir_cms > backup.sql
   ```

4. **마이그레이션 테스트**
   - 스테이징 환경에서 먼저 테스트
   - 롤백 시나리오 확인

## 트러블슈팅

### 마이그레이션 충돌

```bash
# 현재 마이그레이션 상태 확인
npm run migration:show

# 필요시 특정 마이그레이션까지 롤백
npm run migration:revert
```

### 개발 환경 리셋

```bash
# Docker 데이터베이스 초기화
docker compose down -v
docker compose up -d

# 애플리케이션 재시작 (자동 동기화)
npm run start:dev
```

### 환경 변수 확인

```bash
# .env 파일 확인
cat .env | grep DATABASE

# 또는
cat .env | grep DB_SYNCHRONIZE
```

## 추가 자료

- [TypeORM Migrations 공식 문서](https://typeorm.io/migrations)
- [TypeORM CLI 공식 문서](https://typeorm.io/using-cli)
- [프로젝트 Docker 가이드](./DOCKER.md)
