# 백업 시스템 문서

루미르 CMS 백엔드의 데이터베이스 백업 시스템 문서입니다.

## 📚 문서 목록

### 주요 문서

1. **[데이터베이스 백업 가이드](./database-backup-guide.md)** ⭐
   - 백업 시스템의 전체 개요
   - 백업 전략 및 스케줄
   - 수동 백업 실행 방법
   - 백업 모니터링
   - 백업 복구 절차
   - 문제 해결 가이드

2. **[환경변수 설정 가이드](./environment-variables.md)**
   - 필수 환경변수 설명
   - 환경별 설정 예시
   - 보안 고려사항
   - 문제 해결

### 빠른 시작

백업 시스템을 처음 사용하시나요? 다음 단계를 따라하세요:

#### 1. 환경변수 설정

`.env` 파일에 다음 환경변수를 추가하세요:

```bash
# 백업 활성화
BACKUP_ENABLED=true

# 백업 저장 경로
BACKUP_PATH=./backups/database

# 재시도 설정 (선택사항)
BACKUP_MAX_RETRIES=3
BACKUP_RETRY_DELAY_MS=5000
```

자세한 내용은 [환경변수 설정 가이드](./environment-variables.md)를 참조하세요.

#### 2. 애플리케이션 시작

```bash
npm run start:dev
```

백업 스케줄러가 자동으로 시작됩니다.

#### 3. 백업 테스트

수동으로 백업을 실행하여 시스템을 테스트하세요:

```bash
curl -X POST http://localhost:3000/admin/backup/execute?type=daily \
  -H "Authorization: Bearer {admin-token}"
```

## 🔄 백업 전략 요약

### GFS (Grandfather-Father-Son) 백업

| 타입 | 주기 | 보관 기간 | 실행 시간 |
|------|------|-----------|----------|
| 4시간 | 4시간마다 | 7일 | 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 |
| 일간 | 매일 | 30일 | 01:00 |
| 주간 | 매주 일요일 | 90일 (약 3개월) | 일요일 01:30 |
| 월간 | 매월 1일 | 365일 (1년) | 매월 1일 02:00 |
| 분기 | 분기 첫날 | 730일 (2년) | 1/1, 4/1, 7/1, 10/1 03:00 |
| 연간 | 매년 1월 1일 | 1825일 (5년) | 1월 1일 04:00 |

### 자동 정리

매일 새벽 5시에 보관 기간이 지난 백업이 자동으로 삭제됩니다.

## 🚀 백업 실행 방법

### 1. 스크립트로 실행 (권장)

명령줄에서 직접 실행:

```bash
# 모든 타입 백업
npm run backup

# 특정 타입만
npm run backup daily

# 백업 목록 조회
npm run backup:list

# 만료된 백업 정리
npm run backup:cleanup
```

> 📖 [스크립트 사용 가이드](../../scripts/backup/README.md) 참조

### 2. API로 실행

REST API를 통한 실행:

```bash
# 특정 타입 백업 실행
POST /admin/backup/execute?type={type}

# 모든 타입 백업 실행
POST /admin/backup/execute-all
```

### 3. 자동 스케줄러

백업은 설정된 시간에 자동으로 실행됩니다 (별도 설정 불필요).

## 🛠️ API 엔드포인트

### 백업 실행

```bash
# 특정 타입 백업 실행
POST /admin/backup/execute?type={type}

# 모든 타입 백업 실행
POST /admin/backup/execute-all
```

### 백업 조회

```bash
# 백업 목록 조회
GET /admin/backup/list?type={type}

# 백업 통계 조회
GET /admin/backup/statistics

# 백업 설정 조회
GET /admin/backup/config
```

### 백업 관리

```bash
# 만료된 백업 정리
POST /admin/backup/cleanup
```

자세한 API 사용법은 [데이터베이스 백업 가이드](./database-backup-guide.md#수동-백업-실행)를 참조하세요.

## 📁 디렉토리 구조

```
backups/
├── database/
│   ├── four_hourly/     # 4시간 백업
│   ├── daily/           # 일간 백업
│   ├── weekly/          # 주간 백업
│   ├── monthly/         # 월간 백업
│   ├── quarterly/       # 분기 백업
│   └── yearly/          # 연간 백업
└── README.md
```

## 🔒 보안 고려사항

1. **환경변수 보호**: `.env` 파일은 Git에 포함되지 않도록 설정되어 있습니다.
2. **백업 파일 보호**: 백업 디렉토리는 Git에서 제외됩니다.
3. **접근 권한**: 백업 파일에 대한 접근 권한을 적절히 설정하세요.
4. **비밀번호 관리**: 강력한 데이터베이스 비밀번호를 사용하세요.

## 🆘 문제 해결

일반적인 문제와 해결 방법은 [데이터베이스 백업 가이드](./database-backup-guide.md#문제-해결)의 문제 해결 섹션을 참조하세요.

### 자주 묻는 질문

**Q: 백업이 자동으로 실행되지 않습니다.**  
A: `.env`에서 `BACKUP_ENABLED=true`로 설정되어 있는지 확인하세요.

**Q: 디스크 공간이 부족합니다.**  
A: `POST /admin/backup/cleanup`을 호출하여 만료된 백업을 수동으로 정리하세요.

**Q: pg_dump를 찾을 수 없다는 오류가 발생합니다.**  
A: PostgreSQL 클라이언트 도구를 설치하고 PATH에 추가하세요.

자세한 내용은 [문제 해결 가이드](./database-backup-guide.md#문제-해결)를 참조하세요.

## 📊 모니터링

백업 시스템 상태를 모니터링하는 방법:

### 1. 로그 확인

```bash
tail -f logs/application.log | grep -i backup
```

### 2. API를 통한 모니터링

```bash
# 백업 통계 조회
curl -X GET http://localhost:3000/admin/backup/statistics \
  -H "Authorization: Bearer {admin-token}"
```

### 3. 백업 파일 확인

```bash
# 백업 파일 크기 확인
du -sh ./backups/database/*

# 백업 파일 개수 확인
find ./backups/database -name "*.dump" | wc -l
```

## 🔄 백업 복구

백업 파일은 SQL 평문 형식이므로 `psql` 명령어로 간단하게 복구할 수 있습니다.

### 빠른 복구

```bash
# .env 파일 로드
source .env

# psql로 복구 실행
PGPASSWORD="$DATABASE_PASSWORD" psql \
  -h "$DATABASE_HOST" \
  -p "$DATABASE_PORT" \
  -U "$DATABASE_USERNAME" \
  -d "$DATABASE_NAME" \
  -f "./backups/database/daily/backup_daily_20260121_010000.sql"
```

### 새 데이터베이스로 복구

```bash
# 1. 새 데이터베이스 생성
createdb -h localhost -p 5432 -U postgres lumir_cms_restore

# 2. 백업 복구
psql -h localhost -p 5432 -U postgres -d lumir_cms_restore \
  -f "./backups/database/daily/backup_daily_20260121_010000.sql"
```

### SQL 파일의 장점

- **가독성**: 텍스트 편집기로 열어서 내용 확인 가능
- **편집 가능**: 필요한 부분만 추출하여 복구 가능
- **간단한 복구**: `psql` 명령어 하나로 복구

자세한 내용은 [SQL 복구 가이드](./sql-restore-guide.md)를 참조하세요.

## 📖 추가 리소스

- [PostgreSQL psql 문서](https://www.postgresql.org/docs/current/app-psql.html)
- [TypeORM 문서](https://typeorm.io/)
- [NestJS Schedule 문서](https://docs.nestjs.com/techniques/task-scheduling)
- [TypeORM 백업의 장점](./typeorm-backup-benefits.md) ⭐
- [SQL 복구 상세 가이드](./sql-restore-guide.md)

## 🤝 기여

백업 시스템 개선 아이디어가 있으시면 GitHub Issues에 제안해주세요.

---

**마지막 업데이트**: 2026-01-21  
**버전**: 1.0.0
