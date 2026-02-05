# 📚 Lumir CMS Backend 문서

이 폴더에는 Lumir CMS Backend 프로젝트의 설계, 가이드, 정책 문서가 포함되어 있습니다.

## 📂 문서 구조

### 🎨 [design/](./design/)
시스템 설계 및 기능 설계 문서
- 기능 설계서
- 아키텍처 설계서

### 🗄️ [erd/](./erd/)
데이터베이스 ERD 및 엔티티 관계 문서
- ER 다이어그램
- 시나리오별 검증 문서

### 🔄 [state-flow/](./state-flow/)
상태 흐름 및 컨텍스트 플로우 문서
- 데이터 상태 흐름도
- 컨텍스트별 플로우 다이어그램

### 🚀 [migrations/](./migrations/)
데이터베이스 마이그레이션 가이드
- 마이그레이션 작성 가이드
- 핫픽스 가이드

### 💾 [backup/](./backup/)
데이터베이스 백업 및 복구 가이드
- 백업 전략
- 복구 절차
- 압축 가이드

### 📋 [policies/](./policies/)
시스템 정책 및 관리 규칙
- 권한 관리 정책
- 공개 상태 관리 정책
- 로그 관리 정책

### ⏰ [scheduler/](./scheduler/)
스케줄러 및 자동화 작업 가이드
- 권한 검증 스케줄러

### 🧪 [tests/](./tests/) 🆕
테스트 가이드 및 결과 리포트
- 기능별 테스트 가이드
- 테스트 결과 리포트

---

## 📄 최상위 문서

### 설정 및 환경
- **[default-language-configuration.md](./default-language-configuration.md)**
  - 기본 언어 설정 가이드

- **[docker-login-troubleshooting.md](./docker-login-troubleshooting.md)**
  - Docker 로그인 문제 해결

- **[migration-guide.md](./migration-guide.md)**
  - 마이그레이션 실행 가이드

---

## 🔍 빠른 찾기

### 자주 찾는 문서
- 📌 [마이그레이션 가이드](./migrations/MIGRATION_README.md)
- 📌 [백업/복구 빠른 시작](./backup/quick-start.md)
- 📌 [ERD 다이어그램](./erd/er-diagram.md)
- 📌 [권한 스케줄러 가이드](./scheduler/permission-scheduler-guide.md)
- 📌 [설문 응답 삭제 테스트 가이드](./tests/survey-permission-reduction-test-guide.md) 🆕

### 컨텍스트 플로우
- [공지사항 플로우](./state-flow/context-flows/announcement-context-flow.md)
- [설문조사 플로우](./state-flow/context-flows/survey-context-flow.md)
- [위키 플로우](./state-flow/context-flows/wiki-context-flow.md)
- [전자공시 플로우](./state-flow/context-flows/electronic-disclosure-context-flow.md)

---

## 📝 문서 작성 가이드

### 문서 작성 시 고려사항
1. **명확한 제목**: 문서의 목적과 범위를 명확히
2. **구조화**: 계층적 구조로 정보 정리
3. **예제 포함**: 실제 사용 예제 및 코드 스니펫
4. **업데이트 날짜**: 문서 상단에 작성/수정 날짜 명시
5. **관련 문서 링크**: 연관 문서 링크 제공

### 문서 위치 선택
- **설계 문서** → `design/`
- **ERD 문서** → `erd/`
- **플로우 다이어그램** → `state-flow/`
- **정책/규칙** → `policies/`
- **운영 가이드** → 해당 카테고리 (`backup/`, `migrations/`, `scheduler/`)
- **테스트 관련** → `tests/`

---

## 🔗 외부 참고 자료

- [NestJS 공식 문서](https://docs.nestjs.com/)
- [TypeORM 공식 문서](https://typeorm.io/)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)

---

**마지막 업데이트**: 2026-02-05
