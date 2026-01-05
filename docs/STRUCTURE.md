# 루미르 CMS 백엔드 시스템 구조

## 📁 프로젝트 구조

```
src/
├── domain/                    # Domain Layer - 비즈니스 로직과 엔티티
│   ├── common/               # 공통 도메인 (외부 연동)
│   │   ├── employee/        # 직원 도메인
│   │   ├── department/      # 부서 도메인
│   │   └── sso/            # SSO 인증 도메인
│   ├── core/                # Core Domain (핵심 비즈니스)
│   │   ├── common/types/   # 공통 타입 정의
│   │   ├── announcement-popup/    # 공지사항 팝업
│   │   ├── shareholders-meeting/  # 주주총회
│   │   ├── electronic-disclosure/ # 전자공시
│   │   ├── ir/                    # IR
│   │   ├── brochure/             # 브로슈어
│   │   ├── news/                 # 뉴스
│   │   └── announcement/         # 공지사항
│   └── sub/                 # Sub Domain (부가 기능)
│       ├── lumir-story/     # 루미르 스토리
│       ├── video-gallery/   # 비디오 갤러리
│       ├── survey/          # 설문조사
│       ├── education-management/  # 교육 관리
│       └── wiki/            # 위키
│
├── context/                  # Context Layer - CQRS 패턴
│   └── (TODO: Command/Query Handlers)
│
├── business/                 # Business Layer - 비즈니스 조합 로직
│   └── (TODO: Business Services)
│
└── interface/                # Interface Layer - REST API
    ├── AGENTS.md            # AI 코딩 규칙
    ├── decorators/          # 공용 데코레이터
    └── announcement-popup/  # 공지사항 팝업 API
        ├── dto/            # Data Transfer Objects
        ├── decorators/     # API 데코레이터
        ├── announcement-popup.controller.ts
        ├── announcement-popup.module.ts
        └── index.ts
```

## 🏗️ 구현된 기능

### ✅ Domain Layer

#### Core Domain (핵심 비즈니스)
- [x] **공통 타입 시스템**
  - Language (언어 타입)
  - ContentStatus (콘텐츠 상태)
  - Category (카테고리)
  - Tag (태그)

- [x] **공지사항 팝업 (AnnouncementPopup)**
  - Entity, DTO, Service, Module 구현
  - 상태 관리 (draft, approved, under_review, rejected, opened)
  - 공개/비공개 처리

- [x] **주주총회 (ShareholdersMeeting)**
  - 의결 결과 타입 (ResultOfVote)
  - Entity, DTO 구현

- [x] **전자공시 (ElectronicDisclosure)**
  - Entity, DTO 구현

- [x] **IR (Investor Relations)**
  - Entity, DTO 구현

- [x] **브로슈어 (Brochure)**
  - Entity, DTO 구현

- [x] **뉴스 (News)**
  - Entity, DTO 구현

- [x] **공지사항 (Announcement)**
  - 직원 읽음/응답 처리 기능
  - 조회수 카운팅
  - Entity, DTO 구현

#### Sub Domain (부가 기능)
- [x] **루미르 스토리 (LumirStory)**
  - Entity, DTO 구현

- [x] **비디오 갤러리 (VideoGallery)**
  - Entity, DTO 구현

- [x] **설문조사 (Survey)**
  - 질문 타입 시스템 (InqueryType)
  - 다양한 응답 형식 지원
  - Entity, DTO 구현

- [x] **교육 관리 (EducationManagement)**
  - 수강 직원 상태 관리
  - Entity, DTO 구현

- [x] **위키 (Wiki)**
  - 파일 시스템 구조 (WikiFileSystem)
  - Entity, DTO 구현

### ✅ Interface Layer
- [x] **공지사항 팝업 API**
  - REST API 컨트롤러
  - DTO (Create, Update, Response)
  - API 데코레이터 (Swagger 문서화)
  - CRUD 엔드포인트

### ⏳ 미구현 기능
- [ ] Context Layer (CQRS Command/Query Handlers)
- [ ] Business Layer (비즈니스 조합 로직)
- [ ] 나머지 도메인의 Interface Layer
- [ ] 공용 데코레이터 구현 (@ToBoolean, @DateToUTC 등)
- [ ] E2E 테스트
- [ ] 예외 처리 클래스

## 🔧 다음 단계

### 1. 공용 데코레이터 구현
```typescript
// src/interface/decorators/
- to-boolean.decorator.ts
- date-to-utc.decorator.ts
- parse-uuid.decorator.ts
```

### 2. Context Layer 구현
```typescript
// src/context/announcement-popup/
- commands/
  - create-announcement-popup.command.ts
  - update-announcement-popup.command.ts
- queries/
  - get-announcement-popup.query.ts
  - get-all-announcement-popups.query.ts
```

### 3. Business Layer 구현
```typescript
// src/business/announcement-popup/
- announcement-popup-business.service.ts
```

### 4. 나머지 도메인 Interface Layer 구현
- 주주총회, 전자공시, IR 등 나머지 도메인의 컨트롤러 생성

## 📋 엔티티 관계도

```
Employee (공통)
    ↓ (1:N)
AnnouncementPopup, ShareholdersMeeting, ElectronicDisclosure, 
IR, Brochure, News, Announcement, LumirStory, VideoGallery, 
Survey, EducationManagement, Wiki
```

## 🚀 시작하기

### 환경 변수 설정
`.env` 파일 생성:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=lumir_cms

# Application
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 설치 및 실행
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run start:dev

# API 문서 확인
# http://localhost:3000/api-docs
```

## 📚 참고 문서
- [Interface Layer 코딩 규칙](./src/interface/AGENTS.md)
- [프로젝트 README](./README.md)
