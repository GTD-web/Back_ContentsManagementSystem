# SQL 백업 복구 가이드

## 개요

백업 파일은 SQL 평문 형식(`.sql`)으로 저장됩니다. 이는 텍스트 편집기로 열어볼 수 있고, `psql` 명령어로 간단하게 복구할 수 있습니다.

---

## 백업 파일 형식

### SQL 평문 형식

```sql
-- PostgreSQL database dump
-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

SET statement_timeout = 0;
SET lock_timeout = 0;
...

-- 테이블 생성
CREATE TABLE users (
    id uuid PRIMARY KEY,
    name varchar(255),
    ...
);

-- 데이터 삽입
INSERT INTO users VALUES (...);
...
```

### 파일명 형식

`backup_{type}_{YYYYMMDD}_{HHMMSS}.sql`

**예시:**
- `backup_daily_20260121_010000.sql`
- `backup_weekly_20260119_013000.sql`
- `backup_monthly_20260101_020000.sql`

---

## 백업 복구 방법

### 방법 1: psql 명령어 사용 (권장)

가장 간단하고 직관적인 방법입니다.

```bash
# 기본 복구
psql -h localhost -p 5432 -U postgres -d lumir_cms -f backup_daily_20260121_010000.sql

# 환경변수 사용
PGPASSWORD="${DATABASE_PASSWORD}" psql \
  -h "${DATABASE_HOST}" \
  -p "${DATABASE_PORT}" \
  -U "${DATABASE_USERNAME}" \
  -d "${DATABASE_NAME}" \
  -f "./backups/database/daily/backup_daily_20260121_010000.sql"
```

### 방법 2: 새 데이터베이스로 복구

기존 데이터베이스를 유지하고 새로운 데이터베이스에 복구:

```bash
# 1. 새 데이터베이스 생성
createdb -h localhost -p 5432 -U postgres lumir_cms_restore

# 2. 백업 복구
psql -h localhost -p 5432 -U postgres -d lumir_cms_restore -f backup_daily_20260121_010000.sql
```

### 방법 3: 스크립트로 복구

`scripts/restore-backup.sh` 파일을 생성하여 자동화:

```bash
#!/bin/bash
# 백업 복구 스크립트

set -e

# .env 파일 로드
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# 백업 파일 확인
if [ -z "$1" ]; then
  echo "Usage: $0 <backup-file.sql>"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: 백업 파일을 찾을 수 없습니다: $BACKUP_FILE"
  exit 1
fi

# 확인 메시지
echo "백업 복구 시작: $BACKUP_FILE"
echo "데이터베이스: $DATABASE_NAME"
echo ""
read -p "기존 데이터가 삭제됩니다. 계속하시겠습니까? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "복구가 취소되었습니다."
  exit 0
fi

# 복구 실행
echo "복구 중..."
PGPASSWORD="$DATABASE_PASSWORD" psql \
  -h "$DATABASE_HOST" \
  -p "$DATABASE_PORT" \
  -U "$DATABASE_USERNAME" \
  -d "$DATABASE_NAME" \
  -f "$BACKUP_FILE"

echo ""
echo "✅ 백업 복구가 완료되었습니다."
```

**사용법:**

```bash
chmod +x scripts/restore-backup.sh
./scripts/restore-backup.sh ./backups/database/daily/backup_daily_20260121_010000.sql
```

---

## Windows에서 복구

### PowerShell 사용

```powershell
# 환경변수 설정
$env:PGPASSWORD = "your_password"

# 복구 실행
psql -h localhost -p 5432 -U postgres -d lumir_cms -f ".\backups\database\daily\backup_daily_20260121_010000.sql"
```

### CMD 사용

```cmd
REM 환경변수 설정
set PGPASSWORD=your_password

REM 복구 실행
psql -h localhost -p 5432 -U postgres -d lumir_cms -f ".\backups\database\daily\backup_daily_20260121_010000.sql"
```

---

## 부분 복구

SQL 파일이므로 텍스트 편집기로 열어서 필요한 부분만 추출할 수 있습니다.

### 특정 테이블만 복구

```bash
# 1. SQL 파일에서 특정 테이블 부분만 추출
grep -A 1000 "CREATE TABLE users" backup_daily_20260121_010000.sql > users_backup.sql

# 2. 추출한 부분만 복구
psql -h localhost -p 5432 -U postgres -d lumir_cms -f users_backup.sql
```

### SQL 파일 내용 확인

```bash
# 파일 내용 미리보기
head -n 100 backup_daily_20260121_010000.sql

# 특정 테이블 찾기
grep "CREATE TABLE" backup_daily_20260121_010000.sql
```

---

## 복구 옵션

### 에러 시 계속 진행

```bash
# -v ON_ERROR_STOP=0 옵션 사용
psql -h localhost -p 5432 -U postgres -d lumir_cms \
  -v ON_ERROR_STOP=0 \
  -f backup_daily_20260121_010000.sql
```

### 상세 로그 출력

```bash
# -a (all) 옵션으로 모든 SQL 명령어 출력
psql -h localhost -p 5432 -U postgres -d lumir_cms \
  -a -f backup_daily_20260121_010000.sql
```

### 트랜잭션으로 복구

```bash
# --single-transaction 옵션 (전부 성공하거나 전부 실패)
psql -h localhost -p 5432 -U postgres -d lumir_cms \
  --single-transaction \
  -f backup_daily_20260121_010000.sql
```

---

## 복구 전 권장사항

### 1. 백업 파일 무결성 확인

```bash
# 파일 크기 확인
ls -lh backup_daily_20260121_010000.sql

# 파일 내용 간단히 확인
head backup_daily_20260121_010000.sql
tail backup_daily_20260121_010000.sql

# SQL 구문 체크 (dry-run)
psql -h localhost -p 5432 -U postgres -d lumir_cms \
  -v ON_ERROR_STOP=1 \
  --single-transaction \
  --dry-run \
  -f backup_daily_20260121_010000.sql
```

### 2. 현재 데이터베이스 백업

복구 전에 현재 상태를 백업:

```bash
npm run backup daily
```

### 3. 테스트 데이터베이스에서 먼저 테스트

```bash
# 테스트 DB 생성
createdb -h localhost -p 5432 -U postgres lumir_cms_test

# 테스트 복구
psql -h localhost -p 5432 -U postgres -d lumir_cms_test \
  -f backup_daily_20260121_010000.sql

# 데이터 확인 후 테스트 DB 삭제
dropdb -h localhost -p 5432 -U postgres lumir_cms_test
```

---

## 문제 해결

### "psql: command not found"

PostgreSQL 클라이언트 도구를 설치하세요:

```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql

# Windows
# PostgreSQL 설치 시 포함됨
# PATH에 추가: C:\Program Files\PostgreSQL\15\bin
```

### "FATAL: database does not exist"

데이터베이스를 먼저 생성하세요:

```bash
createdb -h localhost -p 5432 -U postgres lumir_cms
```

### "ERROR: relation already exists"

기존 테이블을 먼저 삭제하거나 새 데이터베이스에 복구하세요:

```bash
# 방법 1: 새 데이터베이스 사용
createdb lumir_cms_new
psql -d lumir_cms_new -f backup.sql

# 방법 2: 기존 DB 삭제 후 재생성
dropdb lumir_cms
createdb lumir_cms
psql -d lumir_cms -f backup.sql
```

---

## SQL 파일의 장점

### 1. 가독성
- 텍스트 편집기로 열어서 내용 확인 가능
- 어떤 데이터가 백업되었는지 직접 볼 수 있음

### 2. 편집 가능
- 필요한 부분만 추출하여 복구 가능
- SQL 명령어를 수정하여 사용 가능

### 3. 호환성
- 모든 PostgreSQL 버전에서 사용 가능
- psql 명령어만 있으면 복구 가능

### 4. 간단한 복구
- pg_restore가 아닌 psql 사용
- 명령어가 더 직관적

---

## 참고 자료

- [PostgreSQL pg_dump 문서](https://www.postgresql.org/docs/current/app-pgdump.html)
- [PostgreSQL psql 문서](https://www.postgresql.org/docs/current/app-psql.html)
- [백업 가이드](./database-backup-guide.md)

---

**마지막 업데이트**: 2026-01-21  
**버전**: 1.0.0
