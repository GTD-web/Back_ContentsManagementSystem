# 데이터 상태 흐름 설계 문서 인덱스

## 📂 전체 문서 구조

```
docs/state-flow/
├── README.md                                    # 폴더 개요
├── document-index.md                            # 이 파일 (전체 문서 색인)
├── data-state-flow.md                           # 전체 아키텍처 설계 문서
├── public-state-management-policy.md            # 공개 상태 관리 정책 ⭐ NEW
└── context-flows/                               # Context별 상세 흐름
    ├── README.md                                # Context 목록 및 공통 패턴
    ├── announcement-context-flow.md             # 공지사항
    ├── survey-context-flow.md                   # 설문조사
    ├── wiki-context-flow.md                     # 위키
    ├── brochure-context-flow.md                 # 브로슈어
    ├── electronic-disclosure-context-flow.md    # 전자공시
    ├── shareholders-meeting-context-flow.md     # 주주총회
    ├── ir-news-context-flow.md                  # IR & 뉴스
    ├── other-contexts-flow.md                   # 기타 Context들
    └── auth-context-flow.md                     # 인증/인가
```

---

## 📚 문서별 상세 내용

### 1. 전체 아키텍처 문서

#### [data-state-flow.md](./data-state-flow.md) ⭐ 필독
**2,454 줄 | 종합 설계 문서**

**목차**:
1. 아키텍처 개요 (Layered + DDD + CQRS)
2. 레이어 구조 및 책임 (Interface/Business/Context/Domain)
3. 데이터 흐름 (전체/Command/Query/복잡한 로직)
4. 데이터 변환 규칙 (Client ↔ Database)
5. 의존성 규칙 (레이어 간, 도메인 간)
6. 주요 패턴 및 원칙 (CQRS, Repository, Domain Service, DTO)
7. 실전 예제 (공지사항 생성/조회 전체 코드)
8. 트랜잭션 및 에러 처리 (보상 트랜잭션)
9. 베스트 프랙티스 (체크리스트, 네이밍, 테스트, 성능, 보안)
10. 참고 자료

**핵심 내용**:
- ✅ 전체 아키텍처 이해
- ✅ 레이어별 책임 명확화
- ✅ Mermaid 다이어그램 (전체 흐름, Sequence, Flowchart)
- ✅ 실제 코드 예시
- ✅ 개발자 체크리스트
- ✅ 코드 리뷰 가이드

**추천 대상**:
- 신규 팀원 (필수)
- 아키텍처 검토자
- 기술 문서 작성자

---

#### [public-state-management-policy.md](./public-state-management-policy.md) ⭐ NEW
**비공개 상태에서만 수정/삭제 가능 정책**

**목차**:
1. 정책 개요
2. 공개 상태 정의 (비공개/공개/공개예약/공개종료)
3. 상태 전환 규칙
4. 수정/삭제 제한 정책
5. 레이어별 구현 가이드 (Domain/Context/Business/Interface)
6. 예외 케이스 (긴급 수정, 관리자 권한)
7. 에러 처리
8. 테스트 전략
9. 적용 대상 엔티티 (10개)
10. 마이그레이션 가이드
11. 모니터링 및 감사
12. FAQ

**핵심 내용**:
- ✅ 공개/비공개 상태 관리 정책
- ✅ 수정/삭제 제한 규칙
- ✅ 레이어별 검증 로직 구현
- ✅ 상태 전환 다이어그램
- ✅ 전체 코드 예시 (Domain → Interface)
- ✅ 테스트 코드 예시

**추천 대상**:
- 백엔드 개발자 (필수)
- 코드 리뷰어
- QA 테스터

---

### 2. Context별 상세 문서 (9개)

#### 2.1 [announcement-context-flow.md](./context-flows/announcement-context-flow.md)
**공지사항 관리 Context**

**주요 내용**:
- ✅ Lazy Creation 패턴 (AnnouncementRead)
- ✅ 3단계 권한 관리 (직원/직급/직책/부서)
- ✅ Survey 연동
- ✅ 알림 발송 (Notification API)
- ✅ 순서 관리 (개별/일괄)

**다이어그램**: 7개 (생성, 수정, 삭제, 목록 조회, 상세 조회, 읽음 처리, 권한 확인)

**특수 패턴**:
- Lazy Creation: 읽을 때만 레코드 생성
- 보상 트랜잭션: Survey 생성 실패 시 Announcement 삭제

---

#### 2.2 [survey-context-flow.md](./context-flows/survey-context-flow.md) ⭐ 복잡도 높음
**설문조사 Context**

**주요 내용**:
- ✅ 타입별 응답 테이블 분리 (7개)
- ✅ Announcement 1:1 연동
- ✅ 완료 추적 (SurveyCompletion)
- ✅ 통계 분석 (질문 타입별)
- ✅ 체크박스 Hard Delete

**다이어그램**: 5개 (설문 생성, 응답 제출, 통계 조회)

**특수 패턴**:
- 타입별 응답 테이블: 성능 최적화
- Hard Delete: 체크박스만 완전 삭제
- 보상 트랜잭션: Announcement와 동기화

---

#### 2.3 [wiki-context-flow.md](./context-flows/wiki-context-flow.md) ⭐ 복잡도 높음
**위키 파일 시스템 Context**

**주요 내용**:
- ✅ Closure Table 패턴 (계층 구조 최적화)
- ✅ 3단계 권한 (Read/Write/Delete)
- ✅ 권한 무효화 추적 (WikiPermissionLog)
- ✅ 경로 이동 (드래그 앤 드롭)
- ✅ 순환 참조 검증

**다이어그램**: 8개 (폴더 생성, 파일 업로드, 경로 이동, 삭제, 구조 조회, Breadcrumb, 권한 확인)

**특수 패턴**:
- Closure Table: 재귀 쿼리 없이 조회
- 권한 무효화: SSO 코드 변경 감지 및 자동 제거
- 스케줄러: 매일 권한 검증

---

#### 2.4 [brochure-context-flow.md](./context-flows/brochure-context-flow.md)
**브로슈어 관리 Context**

**주요 내용**:
- ✅ 다국어 번역 (ko/en/ja/zh)
- ✅ Fallback 전략
- ✅ 번역 동기화 스케줄러 (매일 03:00)
- ✅ 기본 브로슈어 초기화

**다이어그램**: 5개 (생성, 번역 수정, 파일 변경, 목록 조회, 동기화)

**특수 패턴**:
- Translation Sync: 기본 필드 ↔ 한국어 번역 동기화
- 스케줄러: 데이터 일관성 유지

---

#### 2.5 [electronic-disclosure-context-flow.md](./context-flows/electronic-disclosure-context-flow.md)
**전자공시 관리 Context**

**주요 내용**:
- ✅ 다국어 번역
- ✅ DART API 연동 (금융감독원)
- ✅ 공시 유형 분류 (정기/수시/기타)
- ✅ 공시일자 관리

**다이어그램**: 4개 (생성, 번역 수정, 목록 조회, DART 동기화)

**특수 패턴**:
- DART 연동: 외부 공시 시스템 자동 동기화
- 감사 추적: 법적 요구사항

---

#### 2.6 [shareholders-meeting-context-flow.md](./context-flows/shareholders-meeting-context-flow.md)
**주주총회 관리 Context**

**주요 내용**:
- ✅ 다국어 번역 (2단계: 총회, 의결 결과)
- ✅ VoteResult 연동
- ✅ 찬성률 자동 계산
- ✅ 의사록 자동 생성

**다이어그램**: 5개 (주주총회 생성, 의결 결과 추가, 목록 조회, 통계)

**특수 패턴**:
- 2단계 번역: ShareholdersMeeting + VoteResult
- 자동 계산: 찬성률, 의결 결과 타입
- 법적 준수: 상법 규정, 공시 의무

---

#### 2.7 [ir-news-context-flow.md](./context-flows/ir-news-context-flow.md)
**IR 자료 & 뉴스 Context**

**주요 내용**:
- **IR Context**: 다국어, 실적 발표, 투자 설명회
- **News Context**: 언론 보도, 외부 링크, 언론사 분류

**다이어그램**: 4개 (IR 생성, IR 목록 조회, 뉴스 생성, 뉴스 목록 조회)

**공통 패턴**:
- 파일 업로드 (IR: PDF/PPT, News: 썸네일)
- 카테고리 분류
- 날짜 기반 정렬

---

#### 2.8 [other-contexts-flow.md](./context-flows/other-contexts-flow.md)
**기타 Context 모음**

**포함 Context**:
1. **Main Popup**: 노출 기간, 위치/크기 설정, 만료 자동 처리
2. **Video Gallery**: YouTube/Vimeo URL 파싱, 썸네일
3. **Lumir Story**: 조회수, 인기 콘텐츠, 본문 이미지 추출
4. **Language**: 시스템 언어 설정 (ko/en/ja/zh)
5. **Company**: SSO 연동, 조직 정보 캐싱

**특징**:
- 간결한 설명
- 공통 패턴 중심
- 코드 예시 포함

---

#### 2.9 [auth-context-flow.md](./context-flows/auth-context-flow.md)
**인증/인가 Context**

**주요 내용**:
- ✅ SSO 로그인
- ✅ JWT 토큰 발급/검증
- ✅ Guard 구현
- ✅ Role 기반 권한
- ✅ 보안 고려사항

**다이어그램**: 2개 (로그인, 토큰 검증)

---

### 3. 색인 및 가이드 문서 (2개)

#### 3.1 [context-flows/README.md](./context-flows/README.md)
**Context 목록 및 공통 패턴**

**주요 내용**:
- ✅ 전체 Context 비교표 (14개)
- ✅ 공통 Command/Query 흐름
- ✅ 다국어 지원 패턴
- ✅ 권한 관리 패턴
- ✅ 카테고리 연동 패턴
- ✅ 파일 업로드 패턴
- ✅ 스케줄러 패턴
- ✅ 검색 패턴

**활용**:
- Context 빠른 비교
- 공통 패턴 참고
- 새 Context 추가 시 템플릿

---

#### 3.2 [README.md](./README.md) (이 문서의 상위 폴더)
**State Flow 폴더 개요**

**주요 내용**:
- 문서 목록 및 설명
- 아키텍처 요약
- 빠른 시작 가이드
- 코드 작성 체크리스트
- 학습 자료 추천

---

## 🎯 문서 읽기 가이드

### 신규 팀원 (처음 프로젝트 접함)

**1단계**: 전체 구조 파악
- ✅ [README.md](./README.md) - 5분
- ✅ [data-state-flow.md](./data-state-flow.md) 섹션 1-3 - 30분

**2단계**: 레이어 이해
- ✅ [data-state-flow.md](./data-state-flow.md) 섹션 4-6 - 1시간

**3단계**: 실전 예제
- ✅ [data-state-flow.md](./data-state-flow.md) 섹션 7-9 - 1시간

**4단계**: Context 상세
- ✅ [announcement-context-flow.md](./context-flows/announcement-context-flow.md) - 30분
- ✅ [wiki-context-flow.md](./context-flows/wiki-context-flow.md) - 30분

**총 학습 시간**: 약 4시간

---

### 백엔드 개발자 (기능 개발 중)

**시나리오별 참고 문서**:

| 작업 | 참고 문서 | 중점 사항 |
|------|----------|----------|
| 새 기능 추가 | [data-state-flow.md](./data-state-flow.md) 섹션 7 | 실전 예제, 레이어별 체크리스트 |
| 권한 로직 개발 | [announcement-context-flow.md](./context-flows/announcement-context-flow.md) 섹션 5.2 | 권한 확인 흐름, 필터링 로직 |
| 계층 구조 개발 | [wiki-context-flow.md](./context-flows/wiki-context-flow.md) 섹션 5.1 | Closure Table 패턴 |
| 다국어 기능 | [brochure-context-flow.md](./context-flows/brochure-context-flow.md) 섹션 5.1 | Fallback 전략, 번역 동기화 |
| 설문 통계 | [survey-context-flow.md](./context-flows/survey-context-flow.md) 섹션 4.1 | 타입별 집계 쿼리 |
| 트랜잭션 처리 | [data-state-flow.md](./data-state-flow.md) 섹션 8 | 트랜잭션 범위, 보상 트랜잭션 |
| 에러 처리 | [data-state-flow.md](./data-state-flow.md) 섹션 8.2 | 레이어별 에러 책임 |

---

### 코드 리뷰어

**체크리스트 위치**:
- [data-state-flow.md](./data-state-flow.md) 섹션 9.1 - 레이어별 체크리스트
- [README.md](./README.md) - 코드 작성 체크리스트

**검증 항목**:
1. **의존성 규칙**: [data-state-flow.md](./data-state-flow.md) 섹션 5
2. **CQRS 패턴**: [data-state-flow.md](./data-state-flow.md) 섹션 6.1
3. **네이밍 컨벤션**: [data-state-flow.md](./data-state-flow.md) 섹션 9.2
4. **트랜잭션 범위**: [data-state-flow.md](./data-state-flow.md) 섹션 8.1

---

### 아키텍트 (설계 검토)

**핵심 문서**:
1. [data-state-flow.md](./data-state-flow.md) - 전체 아키텍처
2. [context-flows/README.md](./context-flows/README.md) - 공통 패턴
3. 복잡한 Context:
   - [wiki-context-flow.md](./context-flows/wiki-context-flow.md) - Closure Table
   - [survey-context-flow.md](./context-flows/survey-context-flow.md) - 타입별 테이블 분리

**검토 포인트**:
- 레이어 간 의존성 준수
- 도메인 간 의존성 준수
- CQRS 패턴 일관성
- 성능 최적화 전략
- 보안 고려사항

---

## 📊 문서 통계

### 파일 개수
- **총 12개 파일**
  - 메인 문서: 1개 (data-state-flow.md)
  - 정책 문서: 1개 (public-state-management-policy.md)
  - Context 문서: 8개
  - 가이드 문서: 2개 (README, 색인)

### 다이어그램 개수
- **총 약 50개 이상**
  - Sequence Diagram: 약 30개
  - Flowchart: 약 10개
  - ERD: 약 10개

### 코드 예시
- **총 약 150개 이상**
  - TypeScript 코드
  - SQL 쿼리
  - 설정 예시

---

## 🔍 주제별 빠른 찾기

### 패턴별

| 패턴 | 문서 | 섹션 |
|------|------|------|
| **CQRS** | [data-state-flow.md](./data-state-flow.md) | 섹션 6.1 |
| **Repository** | [data-state-flow.md](./data-state-flow.md) | 섹션 6.2 |
| **Domain Service** | [data-state-flow.md](./data-state-flow.md) | 섹션 6.3 |
| **DTO** | [data-state-flow.md](./data-state-flow.md) | 섹션 6.4 |
| **Lazy Creation** | [announcement-context-flow.md](./context-flows/announcement-context-flow.md) | 섹션 5.1 |
| **Closure Table** | [wiki-context-flow.md](./context-flows/wiki-context-flow.md) | 섹션 2.2, 5.1 |
| **다국어 Fallback** | [brochure-context-flow.md](./context-flows/brochure-context-flow.md) | 섹션 5.1 |
| **타입별 테이블 분리** | [survey-context-flow.md](./context-flows/survey-context-flow.md) | 섹션 5.1 |
| **보상 트랜잭션** | [data-state-flow.md](./data-state-flow.md) | 섹션 8.3 |

### 기능별

| 기능 | 문서 | 섹션 |
|------|------|------|
| **권한 관리** | [announcement-context-flow.md](./context-flows/announcement-context-flow.md) | 섹션 5.2 |
| **3단계 권한** | [wiki-context-flow.md](./context-flows/wiki-context-flow.md) | 섹션 5.1 |
| **다국어 지원** | [brochure-context-flow.md](./context-flows/brochure-context-flow.md) | 섹션 2.3, 5.1 |
| **파일 업로드** | [brochure-context-flow.md](./context-flows/brochure-context-flow.md) | 섹션 3.1 |
| **카테고리 연동** | [context-flows/README.md](./context-flows/README.md) | 카테고리 연동 섹션 |
| **통계 분석** | [survey-context-flow.md](./context-flows/survey-context-flow.md) | 섹션 4.1 |
| **외부 API 연동** | [electronic-disclosure-context-flow.md](./context-flows/electronic-disclosure-context-flow.md) | 섹션 5.2 |
| **스케줄러** | [brochure-context-flow.md](./context-flows/brochure-context-flow.md) | 섹션 6 |

### 최적화별

| 최적화 주제 | 문서 | 섹션 |
|------------|------|------|
| **인덱스 전략** | [data-state-flow.md](./data-state-flow.md) | 섹션 9.5 |
| **캐싱 전략** | [data-state-flow.md](./data-state-flow.md) | 섹션 9.5 |
| **N+1 문제** | [data-state-flow.md](./data-state-flow.md) | 섹션 9.5 |
| **쿼리 최적화** | [announcement-context-flow.md](./context-flows/announcement-context-flow.md) | 섹션 7 |
| **Closure Table** | [wiki-context-flow.md](./context-flows/wiki-context-flow.md) | 섹션 6.1 |
| **타입별 테이블** | [survey-context-flow.md](./context-flows/survey-context-flow.md) | 섹션 6.1 |

---

## 🛠️ 문서 활용 시나리오

### 시나리오 1: 새로운 Content Context 추가

**요구사항**: "제품 카탈로그" 기능 추가

**참고 문서 순서**:
1. [data-state-flow.md](./data-state-flow.md) 섹션 2-3 → 레이어 구조 복습
2. [brochure-context-flow.md](./context-flows/brochure-context-flow.md) → 유사 패턴 참고
3. [context-flows/README.md](./context-flows/README.md) → 공통 패턴 확인
4. [data-state-flow.md](./data-state-flow.md) 섹션 7 → 실전 예제 따라하기

**개발 순서**:
1. Domain Layer: `Product` Entity 생성
2. Context Layer: Handler 구현 (Brochure 참고)
3. Business Layer: Business Service 작성
4. Interface Layer: Controller & DTO

---

### 시나리오 2: 복잡한 권한 로직 구현

**요구사항**: "부서별 + 직급별 교집합 권한"

**참고 문서**:
1. [announcement-context-flow.md](./context-flows/announcement-context-flow.md) 섹션 5.2
   → 권한 확인 Flowchart
2. [wiki-context-flow.md](./context-flows/wiki-context-flow.md) 섹션 5.1
   → 3단계 권한 (Read/Write/Delete)
3. [data-state-flow.md](./data-state-flow.md) 섹션 7.3
   → 복잡한 비즈니스 로직 예제

---

### 시나리오 3: 설문조사 통계 개선

**요구사항**: 새로운 질문 타입 추가

**참고 문서**:
1. [survey-context-flow.md](./context-flows/survey-context-flow.md) 섹션 2.3
   → InqueryType 정의
2. [survey-context-flow.md](./context-flows/survey-context-flow.md) 섹션 3.2
   → 응답 제출 로직
3. [survey-context-flow.md](./context-flows/survey-context-flow.md) 섹션 4.1
   → 통계 계산 로직

**구현 단계**:
1. InqueryType enum에 새 타입 추가
2. 새 응답 테이블 Entity 생성
3. saveResponseByType 메서드에 케이스 추가
4. calculateQuestionStatistics 메서드에 통계 로직 추가

---

### 시나리오 4: 성능 문제 해결

**증상**: 목록 조회 느림

**디버깅 순서**:
1. [data-state-flow.md](./data-state-flow.md) 섹션 9.5 → 성능 최적화 전략 확인
2. 해당 Context 문서의 "성능 최적화" 섹션 확인
3. 인덱스 전략 검토
4. N+1 문제 확인
5. 캐싱 적용 검토

---

## 📈 문서 버전 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| v1.0 | 2026-01-14 | 초기 문서 작성 (전체 아키텍처) |
| v2.0 | 2026-01-14 | Context별 상세 문서 추가 (9개) |
| v2.1 | 2026-01-14 | Survey Context 추가, 문서 색인 추가 |
| v2.2 | 2026-01-16 | 공개 상태 관리 정책 문서 추가 |

---

## 🔗 외부 링크

### NestJS 관련
- [NestJS Documentation](https://docs.nestjs.com/)
- [NestJS CQRS](https://docs.nestjs.com/recipes/cqrs)
- [NestJS Guards](https://docs.nestjs.com/guards)

### TypeORM 관련
- [TypeORM Documentation](https://typeorm.io/)
- [TypeORM Relations](https://typeorm.io/relations)
- [TypeORM QueryBuilder](https://typeorm.io/select-query-builder)

### 디자인 패턴
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Closure Table Pattern](https://www.slideshare.net/billkarwin/models-for-hierarchical-data)

---

## 📞 문서 유지보수

### 문서 업데이트가 필요한 경우

1. **새 Context 추가 시**:
   - context-flows/에 새 문서 추가
   - context-flows/README.md 테이블 업데이트
   - 이 문서(document-index.md) 업데이트

2. **아키텍처 변경 시**:
   - data-state-flow.md 해당 섹션 수정
   - 영향받는 Context 문서 수정

3. **새 패턴 도입 시**:
   - data-state-flow.md 섹션 6에 추가
   - context-flows/README.md 공통 패턴에 추가

---

**최종 업데이트**: 2026년 1월 14일  
**문서 관리자**: Development Team  
**다음 리뷰 예정**: 2026년 4월 (분기별)
