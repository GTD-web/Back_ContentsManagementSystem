# 백업 시스템 환경변수 설정

## 필수 환경변수

백업 시스템을 사용하려면 `.env` 파일에 다음 환경변수를 설정해야 합니다.

### 데이터베이스 연결 정보

백업 시스템은 기존 데이터베이스 연결 정보를 사용합니다:

```bash
# PostgreSQL 데이터베이스 연결 정보
DATABASE_HOST=localhost                      # 데이터베이스 호스트
DATABASE_PORT=5432                           # 데이터베이스 포트
DATABASE_USERNAME=postgres                   # 데이터베이스 사용자명
DATABASE_PASSWORD=your_secure_password       # 데이터베이스 비밀번호
DATABASE_NAME=lumir_cms                      # 데이터베이스 이름
```

### 백업 설정

```bash
# 백업 활성화 여부
BACKUP_ENABLED=true                          # true 또는 false

# 백업 저장 경로
BACKUP_PATH=./backups/database               # 상대 경로 또는 절대 경로

# 백업 재시도 설정
BACKUP_MAX_RETRIES=3                         # 백업 실패 시 재시도 횟수 (기본: 3)
BACKUP_RETRY_DELAY_MS=5000                   # 재시도 간 대기 시간(밀리초) (기본: 5000)
```

## 환경별 설정 예시

### 개발 환경 (.env.development)

```bash
# 데이터베이스
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=dev_password
DATABASE_NAME=lumir_cms_dev

# 백업
BACKUP_ENABLED=true
BACKUP_PATH=./backups/database
BACKUP_MAX_RETRIES=3
BACKUP_RETRY_DELAY_MS=5000
```

### 스테이징 환경 (.env.staging)

```bash
# 데이터베이스
DATABASE_HOST=staging-db.example.com
DATABASE_PORT=5432
DATABASE_USERNAME=lumir_cms_user
DATABASE_PASSWORD=staging_secure_password
DATABASE_NAME=lumir_cms_staging

# 백업
BACKUP_ENABLED=true
BACKUP_PATH=/var/backups/lumir-cms/database
BACKUP_MAX_RETRIES=3
BACKUP_RETRY_DELAY_MS=5000
```

### 프로덕션 환경 (.env.production)

```bash
# 데이터베이스
DATABASE_HOST=prod-db.example.com
DATABASE_PORT=5432
DATABASE_USERNAME=lumir_cms_user
DATABASE_PASSWORD=production_very_secure_password
DATABASE_NAME=lumir_cms_prod

# 백업
BACKUP_ENABLED=true
BACKUP_PATH=/var/backups/lumir-cms/database  # 전용 백업 볼륨 사용 권장
BACKUP_MAX_RETRIES=5                         # 프로덕션에서는 재시도 횟수 증가
BACKUP_RETRY_DELAY_MS=10000                  # 프로덕션에서는 재시도 간격 증가
```

## 환경변수 설명

### BACKUP_ENABLED

- **타입**: Boolean (true/false)
- **기본값**: false
- **설명**: 백업 시스템을 활성화할지 여부를 설정합니다.
- **권장사항**:
  - 개발 환경: `true` (테스트 목적)
  - 스테이징 환경: `true` (프로덕션과 동일하게)
  - 프로덕션 환경: `true` (필수)

```bash
# 백업 활성화
BACKUP_ENABLED=true

# 백업 비활성화 (테스트 환경 등)
BACKUP_ENABLED=false
```

### BACKUP_PATH

- **타입**: String (경로)
- **기본값**: ./backups/database
- **설명**: 백업 파일을 저장할 디렉토리 경로입니다.
- **권장사항**:
  - 개발 환경: 프로젝트 루트의 `./backups/database` 사용
  - 프로덕션 환경: 별도의 백업 전용 볼륨 사용 (예: `/var/backups/lumir-cms/database`)

```bash
# 상대 경로 (개발 환경)
BACKUP_PATH=./backups/database

# 절대 경로 (프로덕션 환경)
BACKUP_PATH=/var/backups/lumir-cms/database

# Windows 경로
BACKUP_PATH=C:/Backups/lumir-cms/database
```

**주의사항**:
- 경로에 충분한 디스크 공간이 있는지 확인하세요
- 애플리케이션이 해당 경로에 쓰기 권한을 가지고 있는지 확인하세요
- 프로덕션에서는 별도의 마운트 포인트 사용을 권장합니다

### BACKUP_MAX_RETRIES

- **타입**: Number
- **기본값**: 3
- **설명**: 백업 실패 시 재시도할 최대 횟수입니다.
- **권장사항**:
  - 개발 환경: `3` (빠른 실패)
  - 프로덕션 환경: `5` (안정성 우선)

```bash
# 재시도 3회
BACKUP_MAX_RETRIES=3

# 재시도 5회 (프로덕션)
BACKUP_MAX_RETRIES=5

# 재시도 없음
BACKUP_MAX_RETRIES=1
```

### BACKUP_RETRY_DELAY_MS

- **타입**: Number (밀리초)
- **기본값**: 5000 (5초)
- **설명**: 백업 재시도 사이의 대기 시간입니다.
- **권장사항**:
  - 개발 환경: `5000` (5초)
  - 프로덕션 환경: `10000` (10초, 데이터베이스 부하 고려)

```bash
# 5초 대기
BACKUP_RETRY_DELAY_MS=5000

# 10초 대기 (프로덕션)
BACKUP_RETRY_DELAY_MS=10000

# 1초 대기 (빠른 재시도)
BACKUP_RETRY_DELAY_MS=1000
```

## 디렉토리 구조

환경변수 설정 후 백업 디렉토리는 다음과 같이 구성됩니다:

```
{BACKUP_PATH}/
├── four_hourly/    # 4시간 백업
├── daily/          # 일간 백업
├── weekly/         # 주간 백업
├── monthly/        # 월간 백업
├── quarterly/      # 분기 백업
└── yearly/         # 연간 백업
```

디렉토리는 첫 백업 실행 시 자동으로 생성됩니다.

## 환경변수 검증

환경변수가 올바르게 설정되었는지 확인하는 방법:

### 1. 애플리케이션 시작 로그 확인

```bash
npm run start:dev

# 로그에서 확인:
# [DatabaseModule] 데이터베이스 연결 성공
# [BackupService] 백업 시스템 초기화 완료
```

### 2. 백업 설정 API 호출

```bash
curl -X GET http://localhost:3000/admin/backup/config \
  -H "Authorization: Bearer {admin-token}"

# 응답 확인:
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

### 3. 테스트 백업 실행

```bash
curl -X POST http://localhost:3000/admin/backup/execute?type=daily \
  -H "Authorization: Bearer {admin-token}"

# 성공 시:
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

## 보안 고려사항

### 1. 비밀번호 관리

```bash
# ❌ 잘못된 방법: 평문 비밀번호를 .env에 직접 저장
DATABASE_PASSWORD=my_password_123

# ✅ 올바른 방법: 강력한 비밀번호 사용
DATABASE_PASSWORD=xK9#mP2$vL8@qR5&nW7
```

### 2. 환경변수 파일 보호

```bash
# .env 파일 권한 제한
chmod 600 .env

# .gitignore에 포함 확인
echo ".env" >> .gitignore

# Git에서 제외 확인
git ls-files .env
# (아무것도 출력되지 않아야 함)
```

### 3. 프로덕션 환경

프로덕션 환경에서는 다음 방법 중 하나를 사용하세요:

- **환경변수 직접 설정** (Docker, Kubernetes 등)
- **비밀 관리 서비스** (AWS Secrets Manager, HashiCorp Vault 등)
- **암호화된 환경변수 파일**

```bash
# Docker Compose 예시
environment:
  - BACKUP_ENABLED=true
  - BACKUP_PATH=/var/backups/database
  - DATABASE_PASSWORD=${DATABASE_PASSWORD}  # 외부에서 주입
```

## 문제 해결

### 백업 경로에 접근할 수 없음

```bash
# 디렉토리 존재 확인
ls -la ./backups/database

# 없으면 생성
mkdir -p ./backups/database

# 권한 확인 및 부여
chmod 755 ./backups
chmod 755 ./backups/database
```

### 데이터베이스 연결 실패

```bash
# 데이터베이스 연결 테스트
psql -h $DATABASE_HOST -p $DATABASE_PORT -U $DATABASE_USERNAME -d $DATABASE_NAME

# 또는
pg_isready -h $DATABASE_HOST -p $DATABASE_PORT
```

### pg_dump를 찾을 수 없음

```bash
# PATH 확인
echo $PATH

# PostgreSQL 클라이언트 도구 설치
# Ubuntu/Debian
sudo apt-get install postgresql-client

# CentOS/RHEL
sudo yum install postgresql

# macOS
brew install postgresql
```

## 추가 리소스

- [메인 백업 가이드](./database-backup-guide.md)
- [PostgreSQL 환경변수 문서](https://www.postgresql.org/docs/current/libpq-envars.html)
- [NestJS 설정 문서](https://docs.nestjs.com/techniques/configuration)

---

**마지막 업데이트**: 2026-01-21  
**버전**: 1.0.0
