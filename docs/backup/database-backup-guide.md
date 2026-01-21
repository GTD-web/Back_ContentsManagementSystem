# 데이터베이스 백업 가이드

## 개요

루미르 CMS 백엔드는 GFS (Grandfather-Father-Son) 백업 전략을 사용하여 데이터베이스를 자동으로 백업합니다. 이 가이드는 백업 시스템의 구성, 사용법, 그리고 복구 방법을 설명합니다.

## 목차

1. [백업 전략](#백업-전략)
2. [환경 설정](#환경-설정)
3. [자동 백업 스케줄](#자동-백업-스케줄)
4. [스크립트로 백업 실행](#스크립트로-백업-실행)
5. [API로 수동 백업 실행](#api로-수동-백업-실행)
6. [백업 모니터링](#백업-모니터링)
7. [백업 복구](#백업-복구)
8. [문제 해결](#문제-해결)
9. [모범 사례](#모범-사례)

---

## 백업 전략

### GFS 백업 전략

이 시스템은 다층 백업 전략을 사용하여 다양한 복구 시나리오에 대응합니다:

| 백업 타입 | 실행 주기 | 보관 기간 | 용도 |
|-----------|----------|-----------|------|
| **4시간** | 4시간마다 | 7일 | 최근 변경사항 빠른 복구 |
| **일간** | 매일 새벽 1시 | 30일 | 지난 한 달 내 특정 시점 복구 |
| **주간** | 매주 일요일 새벽 1시 30분 | 90일 (약 3개월) | 분기별 복구 포인트 |
| **월간** | 매월 1일 새벽 2시 | 365일 (1년) | 1년 내 특정 월 복구 |
| **분기** | 분기 첫날 새벽 3시 | 730일 (2년) | 2년 간 분기별 복구 |
| **연간** | 매년 1월 1일 새벽 4시 | 1825일 (5년) | 5년 간 연간 아카이브 |

### 보관 정책

- 각 백업 타입은 독립적인 보관 기간을 가집니다
- 매일 새벽 5시에 만료된 백업이 자동으로 삭제됩니다
- 백업 파일은 PostgreSQL Custom Format (`.dump`)으로 저장됩니다

### 디렉토리 구조

```
backups/
└── database/
    ├── four_hourly/
    ├── daily/
    ├── weekly/
    ├── monthly/
    ├── quarterly/
    └── yearly/
```

---

## 환경 설정

### 필수 환경변수

`.env` 파일에 다음 환경변수를 설정해야 합니다:

```bash
# 데이터베이스 연결 정보 (이미 설정되어 있어야 함)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=lumir_cms

# 백업 설정
BACKUP_ENABLED=true                          # 백업 활성화 여부 (true/false)
BACKUP_PATH=./backups/database               # 백업 저장 경로
BACKUP_MAX_RETRIES=3                         # 백업 실패 시 재시도 횟수
BACKUP_RETRY_DELAY_MS=5000                   # 재시도 간격 (밀리초)
```

### 선택적 환경변수

```bash
# 프로덕션 환경에서는 별도의 백업 경로 사용 권장
BACKUP_PATH=/var/backups/lumir-cms/database

# 재시도 설정 조정
BACKUP_MAX_RETRIES=5
BACKUP_RETRY_DELAY_MS=10000
```

### 백업 시스템 준비

백업 시스템은 **TypeORM을 사용**하여 순수 Node.js로 백업을 생성합니다.

**장점**:
- ✅ PostgreSQL 클라이언트 설치 불필요
- ✅ pg_dump 설치 불필요
- ✅ Node.js만 있으면 실행 가능
- ✅ 크로스 플랫폼 지원 (Windows, Linux, Mac)

### 디렉토리 권한

백업 디렉토리에 쓰기 권한이 있는지 확인:

```bash
# Linux/Mac
chmod 755 ./backups
chown -R app_user:app_group ./backups

# Windows
# 탐색기에서 backups 폴더 > 속성 > 보안 탭에서 권한 확인
```

---

## 자동 백업 스케줄

### Cron 스케줄

백업은 `@nestjs/schedule`을 사용하여 자동으로 실행됩니다:

```typescript
// 4시간 백업: 00:00, 04:00, 08:00, 12:00, 16:00, 20:00
@Cron('0 */4 * * *')

// 일간 백업: 매일 새벽 1시
@Cron('0 1 * * *')

// 주간 백업: 매주 일요일 새벽 1시 30분
@Cron('30 1 * * 0')

// 월간 백업: 매월 1일 새벽 2시
@Cron('0 2 1 * *')

// 분기 백업: 1/1, 4/1, 7/1, 10/1 새벽 3시
@Cron('0 3 1 1,4,7,10 *')

// 연간 백업: 매년 1월 1일 새벽 4시
@Cron('0 4 1 1 *')

// 백업 정리: 매일 새벽 5시
@Cron('0 5 * * *')
```

### 스케줄 비활성화

백업을 비활성화하려면 `.env` 파일에서:

```bash
BACKUP_ENABLED=false
```

---

## 스크립트로 백업 실행

명령줄에서 직접 백업을 실행할 수 있는 npm 스크립트를 제공합니다.

### 1. 모든 타입 백업 실행

```bash
npm run backup
```

모든 백업 타입(4시간/일/주/월/분기/년)을 순차적으로 실행합니다.

### 2. 특정 타입만 백업 실행

```bash
# 4시간 백업
npm run backup four_hourly

# 일간 백업
npm run backup daily

# 주간 백업
npm run backup weekly

# 월간 백업
npm run backup monthly

# 분기 백업
npm run backup quarterly

# 연간 백업
npm run backup yearly
```

### 3. 백업 목록 조회

```bash
# 모든 백업 목록
npm run backup:list

# 특정 타입만
npm run backup:list daily

# 통계 포함
npm run backup:list -- --stats
```

### 4. 만료된 백업 정리

```bash
npm run backup:cleanup
```

> **상세 가이드**: [스크립트 사용 가이드](../../scripts/backup/README.md)를 참조하세요.

---

## API로 수동 백업 실행

REST API를 통해 백업을 실행할 수도 있습니다.

#### 1. 특정 타입 백업 실행

```bash
# 일간 백업 실행
curl -X POST http://localhost:3000/admin/backup/execute?type=daily \
  -H "Authorization: Bearer {admin-token}"

# 응답 예시
{
  "success": true,
  "message": "백업이 성공적으로 완료되었습니다.",
  "result": {
    "type": "daily",
    "filename": "backup_daily_20260121_153045.dump",
    "size": 1048576,
    "timestamp": "2026-01-21T15:30:45.123Z"
  }
}
```

#### 백업 타입

- `four_hourly` - 4시간 백업
- `daily` - 일간 백업
- `weekly` - 주간 백업
- `monthly` - 월간 백업
- `quarterly` - 분기 백업
- `yearly` - 연간 백업

#### 2. 모든 타입 백업 실행

```bash
curl -X POST http://localhost:3000/admin/backup/execute-all \
  -H "Authorization: Bearer {admin-token}"

# 응답 예시
{
  "success": true,
  "message": "모든 백업이 완료되었습니다. (성공: 6/6)",
  "results": [
    {
      "type": "four_hourly",
      "success": true,
      "filename": "backup_four_hourly_20260121_153045.dump"
    },
    // ... 나머지 타입들
  ]
}
```

---

## 백업 모니터링

### 1. 백업 목록 조회

```bash
# 모든 백업 조회
curl -X GET http://localhost:3000/admin/backup/list \
  -H "Authorization: Bearer {admin-token}"

# 특정 타입 백업만 조회
curl -X GET http://localhost:3000/admin/backup/list?type=daily \
  -H "Authorization: Bearer {admin-token}"

# 응답 예시
{
  "success": true,
  "count": 15,
  "backups": [
    {
      "type": "daily",
      "filename": "backup_daily_20260121_010000.dump",
      "createdAt": "2026-01-21T01:00:00.000Z",
      "expiresAt": "2026-01-22T01:00:00.000Z"
    },
    // ... 더 많은 백업들
  ]
}
```

### 2. 백업 통계 조회

```bash
curl -X GET http://localhost:3000/admin/backup/statistics \
  -H "Authorization: Bearer {admin-token}"

# 응답 예시
{
  "success": true,
  "statistics": {
    "byType": {
      "four_hourly": {
        "count": 6,
        "totalSize": 6291456,
        "oldestBackup": "2026-01-21T00:00:00.000Z"
      },
      "daily": {
        "count": 7,
        "totalSize": 7340032,
        "oldestBackup": "2026-01-15T01:00:00.000Z"
      },
      // ... 다른 타입들
    },
    "total": {
      "count": 30,
      "totalSize": 31457280
    }
  }
}
```

### 3. 백업 설정 조회

```bash
curl -X GET http://localhost:3000/admin/backup/config \
  -H "Authorization: Bearer {admin-token}"

# 응답 예시
{
  "success": true,
  "config": {
    "enabled": true,
    "path": "./backups/database",
    "maxRetries": 3,
    "retryDelayMs": 5000
  }
}
```

### 4. 수동 정리 실행

```bash
curl -X POST http://localhost:3000/admin/backup/cleanup \
  -H "Authorization: Bearer {admin-token}"

# 응답 예시
{
  "success": true,
  "message": "만료된 백업 정리가 완료되었습니다.",
  "result": {
    "total": 30,
    "deleted": 8,
    "errors": 0
  }
}
```

### 로그 모니터링

애플리케이션 로그에서 백업 상태를 확인할 수 있습니다:

```bash
# 백업 관련 로그 필터링
tail -f logs/application.log | grep -i backup

# 로그 예시
[BackupScheduler] 4시간 백업 시작
[BackupService] 백업 성공: four_hourly - backup_four_hourly_20260121_040000.dump (2.5 MB)
[BackupScheduler] 만료된 백업 정리 시작
[BackupRetentionService] 만료된 백업 삭제: four_hourly/backup_four_hourly_20260120_200000.dump (나이: 8시간)
```

---

## 백업 복구

### pg_restore를 사용한 복구

#### 1. 기본 복구

```bash
# 환경변수 설정
export PGPASSWORD="your_password"

# 복구 실행 (-c 옵션: 기존 객체 먼저 삭제)
pg_restore \
  -h localhost \
  -p 5432 \
  -U postgres \
  -d lumir_cms \
  -c \
  -v \
  ./backups/database/daily/backup_daily_20260121_010000.dump
```

#### 2. 새 데이터베이스로 복구

```bash
# 새 데이터베이스 생성
createdb -h localhost -p 5432 -U postgres lumir_cms_restore

# 복구 실행
pg_restore \
  -h localhost \
  -p 5432 \
  -U postgres \
  -d lumir_cms_restore \
  -v \
  ./backups/database/daily/backup_daily_20260121_010000.dump
```

#### 3. 특정 테이블만 복구

```bash
# 특정 테이블만 복구
pg_restore \
  -h localhost \
  -p 5432 \
  -U postgres \
  -d lumir_cms \
  -t users \
  -t posts \
  -v \
  ./backups/database/daily/backup_daily_20260121_010000.dump
```

#### 4. 스키마만 복구

```bash
# 데이터 없이 스키마만 복구
pg_restore \
  -h localhost \
  -p 5432 \
  -U postgres \
  -d lumir_cms \
  -s \
  -v \
  ./backups/database/daily/backup_daily_20260121_010000.dump
```

### 복구 스크립트 예시

`scripts/restore-backup.sh` 파일 생성:

```bash
#!/bin/bash

# 백업 복구 스크립트
# 사용법: ./scripts/restore-backup.sh <backup-file>

set -e

# .env 파일 로드
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
else
  echo "Error: .env 파일을 찾을 수 없습니다."
  exit 1
fi

# 백업 파일 확인
if [ -z "$1" ]; then
  echo "Usage: $0 <backup-file>"
  echo "Example: $0 ./backups/database/daily/backup_daily_20260121_010000.dump"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: 백업 파일을 찾을 수 없습니다: $BACKUP_FILE"
  exit 1
fi

# 복구 실행
echo "백업 복구 시작: $BACKUP_FILE"
echo "데이터베이스: $DATABASE_NAME"
echo ""

read -p "계속하시겠습니까? (y/n) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "복구가 취소되었습니다."
  exit 0
fi

PGPASSWORD="$DATABASE_PASSWORD" pg_restore \
  -h "$DATABASE_HOST" \
  -p "$DATABASE_PORT" \
  -U "$DATABASE_USERNAME" \
  -d "$DATABASE_NAME" \
  -c \
  -v \
  "$BACKUP_FILE"

echo ""
echo "백업 복구가 완료되었습니다."
```

권한 부여:

```bash
chmod +x scripts/restore-backup.sh
```

사용:

```bash
./scripts/restore-backup.sh ./backups/database/daily/backup_daily_20260121_010000.dump
```

---

## 문제 해결

### 1. 백업이 실행되지 않음

**증상**: 스케줄된 시간에 백업이 실행되지 않습니다.

**해결 방법**:

```bash
# 1. 백업 설정 확인
curl -X GET http://localhost:3000/admin/backup/config \
  -H "Authorization: Bearer {admin-token}"

# 2. .env 파일에서 BACKUP_ENABLED=true 확인
grep BACKUP_ENABLED .env

# 3. 애플리케이션 로그 확인
tail -f logs/application.log | grep -i "backup"

# 4. 수동 백업 테스트
curl -X POST http://localhost:3000/admin/backup/execute?type=daily \
  -H "Authorization: Bearer {admin-token}"
```

### 2. pg_dump 명령어를 찾을 수 없음

**증상**: `pg_dump: command not found` 오류

**해결 방법**:

```bash
# PostgreSQL 클라이언트 도구 설치 확인
which pg_dump

# Ubuntu/Debian
sudo apt-get install postgresql-client

# CentOS/RHEL
sudo yum install postgresql

# macOS
brew install postgresql

# Windows: PostgreSQL 설치 디렉토리를 PATH에 추가
# 예: C:\Program Files\PostgreSQL\15\bin
```

### 3. 디스크 공간 부족

**증상**: 백업 실행 중 디스크 공간 부족 오류

**해결 방법**:

```bash
# 디스크 사용량 확인
df -h ./backups

# 백업 통계 확인
curl -X GET http://localhost:3000/admin/backup/statistics \
  -H "Authorization: Bearer {admin-token}"

# 수동으로 만료된 백업 정리
curl -X POST http://localhost:3000/admin/backup/cleanup \
  -H "Authorization: Bearer {admin-token}"

# 또는 오래된 백업 수동 삭제
find ./backups/database/four_hourly -name "*.dump" -mtime +1 -delete
```

### 4. 백업 파일이 너무 큼

**증상**: 백업 파일 크기가 예상보다 큽니다.

**해결 방법**:

```bash
# 백업 파일 압축 추가 (향후 개선 사항)
# 현재는 PostgreSQL Custom Format이 이미 압축되어 있습니다

# 백업 통계로 크기 확인
curl -X GET http://localhost:3000/admin/backup/statistics \
  -H "Authorization: Bearer {admin-token}"

# 특정 백업 타입의 보관 기간 단축 고려
# 예: 4시간 백업의 보관 기간을 2시간으로 단축
```

### 5. 복구 실패

**증상**: `pg_restore` 실행 중 오류 발생

**해결 방법**:

```bash
# 1. 백업 파일 무결성 확인
pg_restore -l ./backups/database/daily/backup_daily_20260121_010000.dump

# 2. 오류 무시하고 계속 진행 (--no-owner, --no-privileges)
pg_restore \
  -h localhost \
  -p 5432 \
  -U postgres \
  -d lumir_cms \
  --no-owner \
  --no-privileges \
  -v \
  ./backups/database/daily/backup_daily_20260121_010000.dump

# 3. 새 데이터베이스로 복구 시도
createdb -h localhost -p 5432 -U postgres lumir_cms_restore
pg_restore \
  -h localhost \
  -p 5432 \
  -U postgres \
  -d lumir_cms_restore \
  -v \
  ./backups/database/daily/backup_daily_20260121_010000.dump
```

---

## 모범 사례

### 1. 정기적인 백업 테스트

```bash
# 월 1회 백업 복구 테스트 수행
# 1. 최신 백업 선택
# 2. 테스트 데이터베이스로 복구
# 3. 데이터 무결성 확인
# 4. 테스트 데이터베이스 삭제
```

### 2. 모니터링 및 알림

```bash
# 백업 실패 시 알림 설정 (향후 구현 권장)
# - Slack 알림
# - 이메일 알림
# - Discord 알림

# 디스크 사용량 모니터링
# - 백업 디렉토리 크기 추적
# - 임계값 초과 시 알림
```

### 3. 오프사이트 백업

프로덕션 환경에서는 백업을 원격 위치에 복사하는 것을 권장합니다:

```bash
# S3로 백업 복사 (향후 구현 권장)
aws s3 sync ./backups/database/ s3://your-bucket/backups/database/

# 또는 rsync로 원격 서버에 복사
rsync -avz ./backups/database/ user@backup-server:/backups/lumir-cms/
```

### 4. 보안

```bash
# 백업 파일 암호화 (향후 구현 권장)
# - 백업 생성 시 자동 암호화
# - 복구 시 자동 복호화

# 백업 디렉토리 접근 권한 제한
chmod 700 ./backups/database
chown -R app_user:app_group ./backups/database
```

### 5. 문서화

```bash
# 백업 및 복구 절차 문서화
# - 복구 시나리오별 절차
# - 담당자 연락처
# - RTO (Recovery Time Objective)
# - RPO (Recovery Point Objective)
```

---

## 추가 리소스

- [PostgreSQL pg_dump 문서](https://www.postgresql.org/docs/current/app-pgdump.html)
- [PostgreSQL pg_restore 문서](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [NestJS Schedule 문서](https://docs.nestjs.com/techniques/task-scheduling)
- [GFS 백업 전략](https://en.wikipedia.org/wiki/Backup_rotation_scheme#Grandfather-father-son)

---

## 지원

백업 시스템에 문제가 있거나 질문이 있으시면:

1. 이 가이드의 [문제 해결](#문제-해결) 섹션을 참조하세요
2. 애플리케이션 로그를 확인하세요
3. GitHub Issues에 문제를 보고하세요
4. 개발팀에 문의하세요

---

**마지막 업데이트**: 2026-01-21  
**버전**: 1.0.0
