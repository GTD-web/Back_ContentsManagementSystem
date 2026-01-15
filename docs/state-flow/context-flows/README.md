# Context별 데이터 흐름 문서

이 폴더는 각 Context의 상세한 데이터 흐름 다이어그램을 포함합니다.

## 📚 문서 목록

### 상세 문서 (Detailed)

주요 Context의 상세 데이터 흐름, 비즈니스 로직, 최적화 전략을 포함합니다.

| Context | 설명 | 주요 특징 |
|---------|------|-----------|
| [**Announcement Context**](./announcement-context-flow.md) | 공지사항 관리 | - Lazy Creation (읽음 표시)<br/>- 3단계 권한 관리<br/>- Survey 연동<br/>- 알림 발송 |
| [**Wiki Context**](./wiki-context-flow.md) | 위키 파일 시스템 | - Closure Table<br/>- 계층 구조 관리<br/>- 3단계 권한 (Read/Write/Delete)<br/>- 권한 무효화 추적 |
| [**Brochure Context**](./brochure-context-flow.md) | 브로슈어 관리 | - 다국어 번역 (ko/en/ja/zh)<br/>- Fallback 전략<br/>- 번역 동기화 스케줄러<br/>- 파일 버전 관리 |
| [**Electronic Disclosure Context**](./electronic-disclosure-context-flow.md) | 전자공시 관리 | - 다국어 번역<br/>- DART 연동<br/>- 공시 유형 분류<br/>- 법적 준수 |
| [**Shareholders Meeting Context**](./shareholders-meeting-context-flow.md) | 주주총회 관리 | - 다국어 번역<br/>- VoteResult 연동<br/>- 찬성률 계산<br/>- 의사록 생성 |
| [**IR & News Context**](./ir-news-context-flow.md) | IR 자료 & 뉴스 | - IR: 다국어, 실적 발표<br/>- News: 언론 보도, 외부 링크 |
| [**Auth Context**](./auth-context-flow.md) | 인증/인가 | - SSO 연동<br/>- JWT 토큰<br/>- Guard 구현<br/>- Role 기반 권한 |
| [**기타 Context**](./other-contexts-flow.md) | 팝업, 비디오, 스토리 등 | - Main Popup: 노출 기간<br/>- Video Gallery: YouTube/Vimeo<br/>- Lumir Story: 조회수<br/>- Language/Company |

### Context 전체 요약

모든 Context의 주요 기능과 특징을 한눈에 볼 수 있습니다.

| Context | 주요 기능 | 다국어 지원 | 특이사항 | 문서 |
|---------|----------|------------|----------|------|
| **Announcement** | 공지사항 관리 | ❌ | Lazy Creation, 권한 관리, Survey 연동 | [상세](./announcement-context-flow.md) |
| **Survey** | 설문조사 | ❌ | 타입별 응답 테이블 분리, Announcement 연동 | [상세](./survey-context-flow.md) |
| **Wiki** | 위키 파일 시스템 | ❌ | Closure Table, 3단계 권한 | [상세](./wiki-context-flow.md) |
| **Brochure** | 브로슈어 관리 | ✅ (4개 언어) | 번역 동기화 스케줄러 | [상세](./brochure-context-flow.md) |
| **Electronic Disclosure** | 전자공시 관리 | ✅ (4개 언어) | DART 연동, 법적 문서 | [상세](./electronic-disclosure-context-flow.md) |
| **Shareholders Meeting** | 주주총회 관리 | ✅ (4개 언어) | VoteResult, 찬성률 계산 | [상세](./shareholders-meeting-context-flow.md) |
| **IR** | IR 자료 관리 | ✅ (4개 언어) | 실적 발표, 투자 설명회 | [상세](./ir-news-context-flow.md) |
| **News** | 뉴스 관리 | ❌ | 외부 링크, 언론사 분류 | [상세](./ir-news-context-flow.md) |
| **Main Popup** | 메인 팝업 관리 | ✅ (4개 언어) | 노출 기간, 위치 설정 | [간단](./other-contexts-flow.md) |
| **Video Gallery** | 비디오 콘텐츠 | ❌ | YouTube/Vimeo 연동 | [간단](./other-contexts-flow.md) |
| **Lumir Story** | 회사 스토리 | ❌ | 조회수, 인기 콘텐츠 | [간단](./other-contexts-flow.md) |
| **Language** | 언어 관리 | - | 시스템 언어 설정 | [간단](./other-contexts-flow.md) |
| **Company** | 조직 정보 | - | SSO 연동, 캐싱 | [간단](./other-contexts-flow.md) |
| **Auth** | 인증/인가 | - | JWT, SSO, Guard | [간단](./auth-context-flow.md) |
| **Seed Data** | 시드 데이터 | - | 초기 데이터 생성 | README 참조 |

---

## 🔄 공통 패턴

### Command 흐름 (상태 변경)

모든 Context의 Command 흐름은 다음 패턴을 따릅니다:

```
Client → Controller → Business Service → Context Service 
  → Command Bus → Command Handler → Domain Service 
  → Repository → Database
```

**특징**:
- ✅ CQRS 패턴
- ✅ 트랜잭션 관리 (Command Handler)
- ✅ 비즈니스 규칙 검증
- ✅ 도메인 이벤트 발행 (선택적)

### Query 흐름 (상태 조회)

모든 Context의 Query 흐름은 다음 패턴을 따릅니다:

```
Client → Controller → Business Service → Context Service 
  → Query Bus → Query Handler → Repository → Database
```

**특징**:
- ✅ 읽기 전용
- ✅ 성능 최적화 (필요한 컬럼만 조회)
- ✅ 페이지네이션
- ✅ 캐싱 가능

---

## 📊 다국어 지원 Context

다국어를 지원하는 Context들은 공통 패턴을 사용합니다.

### 지원 언어
- 한국어 (ko) - 기본 언어
- 영어 (en)
- 일본어 (ja)
- 중국어 (zh)

### Fallback 전략

```
요청 언어 → 한국어 (기본) → 영어 → 사용 가능한 첫 번째 번역
```

### 번역 테이블 패턴

```typescript
@Entity('entity_translations')
export class EntityTranslation {
  @Column('uuid')
  entityId: string; // 부모 엔티티 ID

  @Column('uuid')
  languageId: string; // 언어 ID

  @Column()
  title: string;

  @Column('text')
  content: string;

  @ManyToOne(() => Entity)
  entity: Entity;

  @ManyToOne(() => Language)
  language: Language;

  @Unique(['entityId', 'languageId']) // 복합 유니크
}
```

**다국어 Context 목록**:
- Brochure (브로슈어)
- IR (투자자 정보)
- Electronic Disclosure (전자공시)
- Shareholders Meeting (주주총회)
- Main Popup (메인 팝업)

---

## 🔐 권한 관리 패턴

### 공지사항/Wiki 권한 구조

```typescript
interface PermissionConfig {
  employeeIds?: string[];        // 특정 직원
  rankCodes?: string[];          // 직급
  positionCodes?: string[];      // 직책
  departmentCodes?: string[];    // 부서
}
```

### 권한 확인 흐름

```
1. 특정 직원 ID 확인
2. SSO에서 사용자 정보 조회
3. 직급 확인
4. 직책 확인
5. 부서 확인
6. 모든 조건 통과 또는 권한 필터 없음 → 허용
```

**권한 관리 Context**:
- Announcement Context (단일 레벨)
- Wiki Context (3단계: Read/Write/Delete)

---

## 📦 카테고리 연동

대부분의 Content Context는 카테고리를 사용합니다.

### 카테고리 매핑 패턴

```typescript
// N:M 관계
Entity (N) ↔ CategoryMapping ↔ (M) Category

// entityType으로 도메인 구분
enum CategoryEntityType {
  ANNOUNCEMENT = 'announcement',
  NEWS = 'news',
  BROCHURE = 'brochure',
  // ...
}
```

**카테고리 사용 Context**:
- Announcement
- News
- Brochure
- IR
- Electronic Disclosure
- Shareholders Meeting
- Lumir Story
- Video Gallery
- Education Management

---

## 🗂️ 파일 업로드 패턴

파일을 다루는 Context의 공통 흐름입니다.

### 업로드 흐름

```
1. Controller: Multipart 파일 수신
2. Business: 파일 검증 (크기, 타입)
3. Storage Service: S3 or Local 업로드
4. Context: URL, Size, MimeType 저장
```

### 지원 파일 타입

- **PDF**: 브로슈어, IR, 전자공시
- **Image**: 뉴스, 스토리, 팝업
- **Video**: 비디오 갤러리
- **Document**: Wiki

**파일 사용 Context**:
- Brochure
- IR
- Electronic Disclosure
- News
- Main Popup
- Video Gallery
- Wiki

---

## 📅 스케줄러 패턴

일부 Context는 정기 작업을 위한 스케줄러를 사용합니다.

### Cron 패턴

```typescript
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ContextScheduler {
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async dailyTask() {
    // 정기 작업 수행
  }
}
```

**스케줄러 사용 Context**:
- Brochure Context: 번역 동기화 (매일 03:00)
- Wiki Context: 권한 검증 (매일 02:00)
- (추가 가능)

---

## 🔍 검색 패턴

검색을 지원하는 Context의 공통 패턴입니다.

### 검색 쿼리

```typescript
queryBuilder
  .where('entity.name LIKE :keyword', { keyword: `%${keyword}%` })
  .orWhere('entity.description LIKE :keyword');

// Full-text search (선택적)
queryBuilder
  .where('to_tsvector(entity.name) @@ plainto_tsquery(:keyword)');
```

**검색 지원 Context**:
- Announcement (제목, 내용)
- Wiki (이름, 설명)
- News (제목, 내용)
- Brochure (제목, 설명)

---

## 🎯 다음 단계

### 새로운 Context 추가 시

1. **템플릿 복사**: 유사한 Context 참고
2. **도메인 모델 정의**: Entity, Relations
3. **Handler 구현**: Commands, Queries
4. **Context Service 작성**: Command/Query 버스 호출
5. **Business Service 구현**: 오케스트레이션
6. **Controller 작성**: HTTP 엔드포인트
7. **문서 작성**: 데이터 흐름 다이어그램

### 문서 작성 가이드

상세 문서가 필요한 경우:
1. [announcement-context-flow.md](./announcement-context-flow.md) 템플릿 사용
2. 도메인 모델, 흐름 다이어그램, 주요 비즈니스 로직 포함

간단한 문서가 필요한 경우:
1. 이 README의 표에 항목 추가
2. 주요 특징과 차이점만 명시

---

## 📞 문의

설계 문서에 대한 질문이나 개선 제안이 있다면 팀 리드에게 문의하세요.

---

**최종 업데이트**: 2026년 1월 14일
