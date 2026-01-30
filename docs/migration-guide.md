# 마이그레이션 가이드

## 개요

이 프로젝트는 TypeORM 마이그레이션을 사용하여 데이터베이스 스키마를 관리합니다.

## 마이그레이션 명령어

### 1. 마이그레이션 실행

```bash
npm run migration:run
```

프로덕션 및 개발 서버에서 마이그레이션을 실행하여 데이터베이스 스키마를 업데이트합니다.

### 2. 마이그레이션 롤백

```bash
npm run migration:revert
```

가장 최근에 실행한 마이그레이션을 되돌립니다.

### 3. 마이그레이션 상태 확인

```bash
npm run migration:show
```

실행된 마이그레이션과 대기 중인 마이그레이션을 확인합니다.

### 4. 새 마이그레이션 생성

```bash
npm run migration:generate -- src/migrations/MigrationName
```

엔티티 변경 사항을 기반으로 새 마이그레이션을 자동 생성합니다.

## 현재 마이그레이션

### 1737619200000-SetDefaultCategoryForNullValues

**목적**: categoryId가 null인 기존 데이터를 기본 카테고리로 설정

**배경**:
- 기존 데이터베이스에 categoryId가 null인 레코드가 존재
- TypeORM synchronize 모드에서 NOT NULL 제약조건 추가 시 에러 발생
- nullable로 변경하면 타입 안정성 및 데이터 무결성 저하

**해결 방법**:
1. 각 엔티티 타입별로 "미분류" 기본 카테고리 생성
2. null 값을 가진 categoryId를 기본 카테고리로 업데이트
3. NOT NULL 제약조건 유지

**영향받는 테이블**:
- `brochures` (브로슈어)
- `irs` (IR 자료)
- `electronic_disclosures` (전자공시)
- `shareholders_meetings` (주주총회)
- `announcements` (공지사항)
- `lumir_stories` (루미르 스토리)
- `video_galleries` (비디오 갤러리)
- `news` (뉴스)
- `main_popups` (메인 팝업)

**생성되는 카테고리**:
각 엔티티 타입별로 "미분류" 카테고리가 생성됩니다:
- 브로슈어: `entityType='brochure'`, `name='미분류'`
- IR: `entityType='ir'`, `name='미분류'`
- 전자공시: `entityType='electronic_disclosure'`, `name='미분류'`
- 주주총회: `entityType='shareholders_meeting'`, `name='미분류'`
- 공지사항: `entityType='announcement'`, `name='미분류'`
- 루미르 스토리: `entityType='lumir_story'`, `name='미분류'`
- 비디오 갤러리: `entityType='video_gallery'`, `name='미분류'`
- 뉴스: `entityType='news'`, `name='미분류'`
- 메인 팝업: `entityType='main_popup'`, `name='미분류'`

## 마이그레이션 배포 절차

### 개발 환경

1. 로컬에서 마이그레이션 테스트:
```bash
npm run migration:run
```

2. 문제가 없으면 커밋 및 푸시

### 프로덕션 배포

1. 서버에 접속
2. 코드 pull
3. 빌드:
```bash
npm run build
```

4. 마이그레이션 실행:
```bash
npm run migration:run
```

5. 애플리케이션 재시작

## 주의사항

### synchronize 설정

- **프로덕션**: `synchronize: false` (필수)
- **개발**: `synchronize: false` (마이그레이션으로 관리)
- **테스트**: `synchronize: true` (허용)

현재 설정:
```typescript
// libs/database/database.module.ts
synchronize: false, // 마이그레이션으로 스키마 관리
```

### 마이그레이션 작성 시 유의사항

1. **트랜잭션**: 모든 마이그레이션은 트랜잭션 내에서 실행됩니다
2. **롤백 가능성**: `down` 메서드를 항상 구현하여 롤백 가능하도록 작성
3. **데이터 검증**: 데이터 변환 시 기존 데이터 확인 및 검증
4. **타임스탬프**: 마이그레이션 파일명은 타임스탬프로 시작 (예: `1737619200000-...`)

## 트러블슈팅

### "column contains null values" 에러

**증상**:
```
QueryFailedError: column "categoryId" of relation "brochures" contains null values
```

**원인**: 
- null 값이 있는 컬럼에 NOT NULL 제약조건 추가 시도

**해결**:
1. 현재 마이그레이션 실행: `npm run migration:run`
2. 기본 카테고리가 자동 생성되고 null 값이 업데이트됨

### 마이그레이션이 실행되지 않음

**확인 사항**:
1. 빌드 완료 여부: `npm run build`
2. 데이터베이스 연결 확인
3. 환경 변수 설정 확인 (DATABASE_HOST, DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_NAME)

### 마이그레이션 롤백 필요

```bash
npm run migration:revert
```

롤백 후 문제를 수정하고 다시 마이그레이션 실행

## 데이터베이스 백업

마이그레이션 실행 전 반드시 데이터베이스 백업을 수행하세요:

```bash
# 백업 생성
npm run backup

# 백업 목록 확인
npm run backup:list
```

## 참고 자료

- [TypeORM Migrations](https://typeorm.io/migrations)
- [프로젝트 README](../README.md)
