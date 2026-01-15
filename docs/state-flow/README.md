# 데이터 상태 흐름 설계 (State Flow)

이 폴더는 프로젝트의 데이터 상태 흐름 및 아키텍처 설계 문서를 포함합니다.

## 📋 문서 목록

### [data-state-flow.md](./data-state-flow.md)
**데이터 상태 흐름 설계 문서** - 프로젝트의 핵심 아키텍처 문서

**포함 내용**:
- 레이어드 아키텍처 개요
- 각 레이어의 책임과 역할
- 데이터 흐름 다이어그램 (Command/Query)
- 레이어 간 데이터 변환 규칙
- 의존성 규칙 (레이어 간, 도메인 간)
- CQRS 패턴 및 주요 디자인 패턴
- 실전 예제 (공지사항 생성/조회)
- 트랜잭션 및 에러 처리 전략
- 베스트 프랙티스

### [context-flows/](./context-flows/)
**Context별 데이터 흐름 문서** - 각 Context의 상세 흐름 다이어그램

**주요 문서**:
- [Announcement Context](./context-flows/announcement-context-flow.md) - 공지사항 (Lazy Creation, 권한)
- [Survey Context](./context-flows/survey-context-flow.md) - 설문조사 (타입별 응답 테이블)
- [Wiki Context](./context-flows/wiki-context-flow.md) - 위키 (Closure Table, 계층 구조)
- [Brochure Context](./context-flows/brochure-context-flow.md) - 브로슈어 (다국어, 동기화)
- [Electronic Disclosure Context](./context-flows/electronic-disclosure-context-flow.md) - 전자공시 (DART 연동)
- [Shareholders Meeting Context](./context-flows/shareholders-meeting-context-flow.md) - 주주총회 (의결 결과)
- [IR & News Context](./context-flows/ir-news-context-flow.md) - IR 자료 & 뉴스
- [기타 Context](./context-flows/other-contexts-flow.md) - 팝업, 비디오, 스토리 등
- [Auth Context](./context-flows/auth-context-flow.md) - 인증/인가 (SSO, JWT)
- [Context 목록 및 패턴](./context-flows/README.md) - 전체 Context 개요 및 공통 패턴

## 🎯 이 문서를 읽어야 하는 사람

- ✅ 신규 팀원 (프로젝트 구조 이해)
- ✅ 백엔드 개발자 (레이어 설계 가이드)
- ✅ 아키텍트 (설계 의사결정 참고)
- ✅ 코드 리뷰어 (아키텍처 규칙 검증)

## 🏗️ 아키텍처 요약

### 레이어 구조
```
Interface Layer (Controller, DTO)
    ↓
Business Layer (비즈니스 오케스트레이션)
    ↓
Context Layer (CQRS, 상태 관리)
    ↓
Domain Layer (Entity, Domain Service)
    ↓
Infrastructure Layer (Database, Config)
```

### 핵심 패턴
- **Layered Architecture**: 계층형 구조, 단방향 의존성
- **Domain-Driven Design (DDD)**: 도메인 중심 설계 (Common/Core/Sub)
- **CQRS**: Command와 Query 분리
- **Repository Pattern**: 데이터 접근 추상화

## 📚 관련 문서

- [ER 다이어그램](../erd/er-diagram.md) - 데이터베이스 구조
- [Domain Layer README](../../src/domain/README.md) - 도메인 레이어 상세
- [멀티랭귀지 전략](../../.cursor/multilingual-strategy.mdc) - 다국어 지원 전략
- [Wiki 권한 전략](../../.cursor/wiki-permission-strategy.mdc) - 권한 관리 전략

## 🚀 빠른 시작

### 1. 아키텍처 이해하기

먼저 [data-state-flow.md](./data-state-flow.md)를 읽고 전체 아키텍처를 이해하세요.

**학습 순서**:
1. 레이어 구조 및 책임 (섹션 2)
2. 데이터 흐름 (섹션 3)
3. 주요 패턴 (섹션 6)
4. 실전 예제 (섹션 7)

### 2. Context별 상세 흐름 파악하기

작업하려는 Context의 상세 문서를 읽으세요.

**예시**:
- 공지사항 기능 개발 → [Announcement Context](./context-flows/announcement-context-flow.md)
- Wiki 권한 수정 → [Wiki Context](./context-flows/wiki-context-flow.md)
- 다국어 번역 작업 → [Brochure Context](./context-flows/brochure-context-flow.md)
- 전자공시 DART 연동 → [Electronic Disclosure Context](./context-flows/electronic-disclosure-context-flow.md)
- 주주총회 의결 결과 → [Shareholders Meeting Context](./context-flows/shareholders-meeting-context-flow.md)
- 비디오/팝업 등 → [기타 Context](./context-flows/other-contexts-flow.md)

### 3. 새로운 기능 추가하기

1. **Domain Layer**: 엔티티 및 Domain Service 정의
2. **Context Layer**: Command/Query Handler 구현
3. **Business Layer**: 비즈니스 로직 오케스트레이션
4. **Interface Layer**: Controller 및 DTO 정의

**참고**: [data-state-flow.md](./data-state-flow.md)의 "7. 실전 예제" 섹션

## ✅ 코드 작성 체크리스트

### Interface Layer (Controller)
- [ ] 비즈니스 로직 없이 Business Layer만 호출하는가?
- [ ] DTO 검증이 적절한가? (class-validator)
- [ ] Swagger 문서화가 되어있는가?
- [ ] 에러 처리가 적절한가?

### Business Layer
- [ ] 여러 Context를 적절히 조율하는가?
- [ ] 외부 시스템 연동이 이 레이어에서 처리되는가?
- [ ] 보상 트랜잭션이 필요한 경우 구현되었는가?
- [ ] Repository를 직접 주입하지 않았는가?

### Context Layer
- [ ] Command와 Query가 명확히 분리되었는가?
- [ ] Command Handler에서 트랜잭션이 관리되는가?
- [ ] 다른 Context를 직접 호출하지 않는가?
- [ ] 비즈니스 규칙 검증이 구현되었는가?

### Domain Layer
- [ ] Repository 패턴이 적용되었는가?
- [ ] 도메인 규칙 검증이 구현되었는가?
- [ ] 도메인 간 의존성 규칙을 준수하는가? (Common → Core → Sub)
- [ ] 외부 시스템을 연동하지 않았는가?

## 📊 데이터 흐름 예시

### Command 흐름 (공지사항 생성)
```
HTTP POST Request
  → Controller.create()
    → BusinessService.공지사항_생성()
      → ContextService.공지사항을_생성한다()
        → CommandBus.execute(CreateCommand)
          → CommandHandler.execute()
            → DomainService.공지사항을_생성한다()
              → Repository.save()
                → Database INSERT
```

### Query 흐름 (공지사항 목록 조회)
```
HTTP GET Request
  → Controller.getList()
    → BusinessService.공지사항_목록_조회()
      → ContextService.공지사항_목록을_조회한다()
        → QueryBus.execute(GetListQuery)
          → QueryHandler.execute()
            → Repository.find()
              → Database SELECT
```

## 🔍 주요 패턴 빠른 참고

### CQRS 패턴
- **Command**: 상태 변경 (Create, Update, Delete)
  - 트랜잭션 보장
  - 비즈니스 규칙 검증
  - 도메인 이벤트 발행

- **Query**: 상태 조회 (Get, List, Search)
  - 읽기 전용
  - 성능 최적화
  - 캐싱 가능

### Repository 패턴
```typescript
async 엔티티를_생성한다(data: Partial<Entity>) {
  const entity = this.repository.create(data);
  return await this.repository.save(entity);
}

async ID로_조회한다(id: string) {
  return await this.repository.findOne({ where: { id } });
}
```

### 다국어 Fallback
```
요청 언어 → 한국어 (기본) → 영어 → 첫 번째 사용 가능한 번역
```

## 🛠️ 개발 도구

### 레이어별 파일 찾기

```bash
# Interface Layer
src/interface/admin/*/

# Business Layer
src/business/*/

# Context Layer
src/context/*/

# Domain Layer
src/domain/common/
src/domain/core/
src/domain/sub/
```

### 문서 검색

```bash
# 특정 Context 문서 찾기
docs/state-flow/context-flows/*-context-flow.md

# 아키텍처 문서
docs/state-flow/data-state-flow.md

# ERD 문서
docs/erd/er-diagram.md
```

## 🎓 학습 자료

### 추천 읽기 순서 (신규 팀원)

1. **1주차**: 전체 아키텍처 이해
   - [data-state-flow.md](./data-state-flow.md) 정독
   - 레이어별 책임 이해
   - 데이터 흐름 다이어그램 분석

2. **2주차**: Context별 상세 흐름
   - [Announcement Context](./context-flows/announcement-context-flow.md)
   - [Wiki Context](./context-flows/wiki-context-flow.md)
   - [Brochure Context](./context-flows/brochure-context-flow.md) (다국어)
   - [Shareholders Meeting Context](./context-flows/shareholders-meeting-context-flow.md)
   - 실제 코드와 비교하며 이해

3. **3주차**: 실습 및 적용
   - 간단한 기능 추가 (예: 카테고리 추가)
   - 코드 리뷰 받기
   - 베스트 프랙티스 적용

### 외부 참고 자료

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)

## 📞 문의 및 피드백

설계 문서에 대한 질문이나 개선 제안이 있다면 팀 리드에게 문의하세요.

**자주 묻는 질문**:
- Q: Context가 다른 Context를 호출할 수 없나요?
  - A: 네, Business Layer에서 조율해야 합니다.
  
- Q: Domain Service에서 외부 API를 호출할 수 있나요?
  - A: 아니요, Business Layer에서 처리해야 합니다.
  
- Q: Query Handler에서 데이터를 수정할 수 있나요?
  - A: 아니요, Query는 읽기 전용입니다.

---

**최종 업데이트**: 2026년 1월 14일  
**버전**: v2.0 (Context별 문서 추가)
