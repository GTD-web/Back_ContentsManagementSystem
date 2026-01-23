# 배포 가이드

## 긴급 수정: categoryId null 에러 해결

### 문제 상황

```
QueryFailedError: column "categoryId" of relation "brochures" contains null values
```

dev 서버에서 위와 같은 에러가 발생하여 서버가 시작되지 않는 상황

### 원인

1. 기존 데이터베이스에 `categoryId`가 null인 레코드가 존재
2. TypeORM `synchronize: true` 설정으로 인해 엔티티 변경 시 자동으로 스키마 동기화 시도
3. NOT NULL 제약조건을 추가하려 할 때 null 값이 있어 에러 발생

### 해결 방법

#### 1단계: 코드 업데이트

```bash
git pull origin dev
npm install
npm run build
```

#### 2단계: 마이그레이션 실행

```bash
npm run migration:run
```

이 명령어는 다음 작업을 수행합니다:
1. 각 엔티티 타입별로 "미분류" 기본 카테고리 생성
2. null 값을 가진 categoryId를 기본 카테고리로 자동 업데이트
3. 데이터 무결성 유지 (NOT NULL 제약조건 유지)

#### 3단계: 서비스 재시작

```bash
pm2 restart all
# 또는
npm run start:prod
```

### 영향받는 모듈

다음 9개 모듈의 categoryId null 값이 자동으로 "미분류" 카테고리로 설정됩니다:

1. **브로슈어** (brochures)
2. **IR 자료** (irs)
3. **전자공시** (electronic_disclosures)
4. **주주총회** (shareholders_meetings)
5. **공지사항** (announcements)
6. **루미르 스토리** (lumir_stories)
7. **비디오 갤러리** (video_galleries)
8. **뉴스** (news)
9. **메인 팝업** (main_popups)

### 변경 사항

#### 데이터베이스

- **synchronize**: `true` → `false`
  - 이제 마이그레이션으로 스키마를 안전하게 관리합니다
  - 프로덕션에서 자동 스키마 변경으로 인한 데이터 손실 방지

#### 엔티티

- **categoryId 타입**: `string | null` → `string`
  - 타입 안정성 개선
  - null 체크 불필요

#### 새로운 카테고리

각 엔티티 타입별로 "미분류" 카테고리가 자동 생성됩니다:

```sql
-- 예시: 브로슈어 미분류 카테고리
INSERT INTO categories (entityType, name, description, isActive, order)
VALUES ('brochure', '미분류', '기본 브로슈어 카테고리', true, 0);
```

### 롤백 방법 (문제 발생 시)

```bash
# 마이그레이션 롤백
npm run migration:revert

# 이전 코드로 되돌리기
git checkout <previous-commit>
npm run build
pm2 restart all
```

### 확인 사항

마이그레이션 실행 후 다음을 확인하세요:

1. **서버 정상 시작 여부**
```bash
pm2 status
pm2 logs
```

2. **데이터 확인**
```sql
-- null categoryId 확인 (결과가 0이어야 함)
SELECT COUNT(*) FROM brochures WHERE "categoryId" IS NULL;
SELECT COUNT(*) FROM irs WHERE "categoryId" IS NULL;
-- ... 나머지 테이블들도 동일

-- 미분류 카테고리 확인
SELECT * FROM categories WHERE name = '미분류';
```

3. **API 테스트**
- 각 모듈의 목록 조회 API 테스트
- 데이터 생성/수정 API 테스트

### 추가 조치 사항

#### 관리자 페이지에서 확인

1. 각 모듈에 접속하여 "미분류" 카테고리로 분류된 항목 확인
2. 필요시 적절한 카테고리로 재분류
3. 불필요한 경우 "미분류" 카테고리 숨김 또는 삭제 가능

#### 향후 배포 프로세스

1. 로컬에서 마이그레이션 테스트
2. 코드 리뷰 및 승인
3. dev 서버 배포:
   ```bash
   git pull
   npm install
   npm run build
   npm run migration:run
   pm2 restart all
   ```
4. 프로덕션 배포 전 반드시 **데이터베이스 백업**:
   ```bash
   npm run backup
   ```
5. 프로덕션 배포 (dev와 동일한 절차)

### 문의사항

문제가 지속되거나 추가 지원이 필요한 경우:
1. 로그 확인: `pm2 logs --lines 100`
2. 데이터베이스 상태 확인
3. 개발팀에 로그 및 에러 메시지 공유

---

## 일반 배포 절차

### 개발 서버 (dev)

1. 코드 업데이트
```bash
cd /path/to/lumir-cms-backend
git pull origin dev
npm install
```

2. 빌드
```bash
npm run build
```

3. 마이그레이션 실행 (스키마 변경이 있는 경우)
```bash
npm run migration:run
```

4. 서비스 재시작
```bash
pm2 restart lumir-cms-backend
# 또는
pm2 restart all
```

### 프로덕션 서버 (production)

1. **반드시 데이터베이스 백업**
```bash
npm run backup
npm run backup:list  # 백업 확인
```

2. 코드 업데이트
```bash
git pull origin main
npm install
```

3. 빌드
```bash
npm run build
```

4. 마이그레이션 실행 (스키마 변경이 있는 경우)
```bash
npm run migration:run
```

5. 마이그레이션 확인
```bash
npm run migration:show
```

6. 서비스 재시작
```bash
pm2 restart lumir-cms-backend
```

7. 서비스 상태 확인
```bash
pm2 status
pm2 logs lumir-cms-backend --lines 50
```

### 롤백 절차

문제 발생 시:

1. 마이그레이션 롤백
```bash
npm run migration:revert
```

2. 코드 롤백
```bash
git checkout <previous-commit>
npm install
npm run build
```

3. 서비스 재시작
```bash
pm2 restart all
```

4. 필요시 데이터베이스 복구
```bash
# 백업 목록 확인
npm run backup:list

# 백업 복구 (수동)
psql -h <host> -U <user> -d <database> < backup-file.sql
```

### 모니터링

```bash
# 실시간 로그 확인
pm2 logs lumir-cms-backend

# 최근 로그 확인
pm2 logs lumir-cms-backend --lines 100

# 서비스 상태
pm2 status

# 메모리/CPU 사용률
pm2 monit
```
