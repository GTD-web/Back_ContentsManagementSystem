# 테스트 가이드 및 리포트

이 폴더에는 기능별 테스트 가이드와 테스트 결과 리포트가 포함되어 있습니다.

## 📋 테스트 문서 목록

### 공지사항 (Announcement)
- **[announcement-read-lazy-creation-test-report.md](./announcement-read-lazy-creation-test-report.md)**
  - 공지사항 읽음 처리 Lazy Creation 패턴 테스트 리포트
  - 기능: 읽음 기록 지연 생성 및 성능 검증

### 설문조사 (Survey)
- **[survey-permission-reduction-test-guide.md](./survey-permission-reduction-test-guide.md)** 🆕
  - 설문 응답 자동 삭제 기능 테스트 가이드
  - 기능: 공지사항 권한 축소 시 제거된 사용자의 설문 응답 Soft Delete
  - 작성일: 2026-02-05

---

## 📝 테스트 문서 작성 가이드

### 테스트 가이드 (Test Guide)
새로운 기능의 테스트 방법을 설명하는 문서

**포함 내용**:
- 구현 완료 사항
- 테스트 시나리오
- 예상 결과
- 확인 방법 (DB 쿼리, 로그 등)
- 주의사항

**파일명 형식**: `{feature-name}-test-guide.md`

### 테스트 리포트 (Test Report)
실제 수행된 테스트의 결과를 기록하는 문서

**포함 내용**:
- 테스트 수행 날짜 및 환경
- 테스트 케이스별 결과
- 발견된 이슈
- 결론

**파일명 형식**: `{feature-name}-test-report.md`

---

## 🔗 관련 문서

- [마이그레이션 가이드](../migrations/MIGRATION_README.md)
- [백업 가이드](../backup/README.md)
- [스케줄러 가이드](../scheduler/permission-scheduler-guide.md)
