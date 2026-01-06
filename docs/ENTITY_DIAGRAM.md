# 루미르 CMS 엔티티 다이어그램

> 작성일: 2025-01-06  
> 버전: 1.0.0

## 목차

1. [개요](#개요)
2. [공통 타입 (Common Types)](#공통-타입-common-types)
3. [공통 도메인 (Common Domain)](#공통-도메인-common-domain)
4. [핵심 도메인 (Core Domain)](#핵심-도메인-core-domain)
5. [부가 도메인 (Sub Domain)](#부가-도메인-sub-domain)
6. [관계 다이어그램](#관계-다이어그램)
7. [데이터베이스 스키마](#데이터베이스-스키마)

---

## 개요

루미르 CMS 백엔드의 도메인 엔티티 구조를 시각화한 문서입니다.

### 도메인 구조

```
src/domain/
├── common/          # 공통 도메인 (직원, 부서, SSO, 알림 등)
├── core/            # 핵심 비즈니스 도메인
│   ├── common/      # 공통 타입 (Language, Category, Status, Tag)
│   ├── announcement-popup/
│   ├── announcement/
│   ├── shareholders-meeting/
│   ├── electronic-disclosure/
│   ├── ir/
│   ├── brochure/
│   └── news/
└── sub/             # 부가 기능 도메인
    ├── education-management/
    ├── lumir-story/
    ├── survey/
    ├── video-gallery/
    └── wiki/
```

---

## 공통 타입 (Common Types)

### Language (언어)

```mermaid
classDiagram
    class LanguageEnum {
        <<enumeration>>
        KOREAN
        ENGLISH
        JAPANESE
        CHINESE
    }
    
    class LanguageCode {
        <<enumeration>>
        KOREAN = "ko"
        ENGLISH = "en"
        JAPANESE = "ja"
        CHINESE = "zh"
    }
    
    class Language {
        +LanguageCode code
        +string label
        +LanguageEnum name
    }
    
    Language --> LanguageCode
    Language --> LanguageEnum
```

### ContentStatus (콘텐츠 상태)

```mermaid
classDiagram
    class ContentStatus {
        <<enumeration>>
        DRAFT : "초안"
        APPROVED : "승인됨"
        UNDER_REVIEW : "검토중"
        REJECTED : "거부됨"
        OPENED : "공개됨"
    }
```

**사용처**: Announcement, ElectronicDisclosure, IR, Brochure, LumirStory, VideoGallery, News, Survey

### Category (카테고리)

```mermaid
classDiagram
    class Category {
        +string id
        +string name
        +string description
    }
```

**별칭 타입**:
- `AnnouncementCategory`
- `ShareholdersMeetingCategory`
- `ElectronicDisclosureCategory`
- `IRCategory`
- `BrochureCategory`
- `LumirStoryCategory`
- `VideoGalleryCategory`
- `NewsCategory`
- `SurveyCategory`

### Tag (태그)

```mermaid
classDiagram
    class Tag {
        +string id
        +string name
        +string description
    }
```

### BaseEntity (기본 엔티티)

```mermaid
classDiagram
    class BaseEntity~T~ {
        <<abstract>>
        +string id
        +Date createdAt
        +Date updatedAt
        +Date? deletedAt
        +string? createdBy
        +string? updatedBy
        +number version
        +DTO로_변환한다() T
    }
```

---

## 공통 도메인 (Common Domain)

### Employee (직원)

```mermaid
classDiagram
    class Employee {
        +string employeeNumber
        +string name
        +string email
        +string? phoneNumber
        +Date? dateOfBirth
        +EmployeeGender? gender
        +Date? hireDate
        +string? managerId
        +EmployeeStatus status
        +string? departmentId
        +string? departmentName
        +string? departmentCode
        +string? positionId
        +string? rankId
        +string? rankName
        +string? rankCode
        +number? rankLevel
        +string externalId
        +Date externalCreatedAt
        +Date externalUpdatedAt
        +Date? lastSyncAt
        +string[]? roles
        +boolean isExcludedFromList
        +string? excludeReason
        +string? excludedBy
        +Date? excludedAt
        +boolean isAccessible
    }
    
    class EmployeeGender {
        <<enumeration>>
        MALE
        FEMALE
    }
    
    class EmployeeStatus {
        <<enumeration>>
        재직중
        휴직중
        퇴사
    }
    
    Employee --> EmployeeGender
    Employee --> EmployeeStatus
    BaseEntity <|-- Employee
```

### Department (부서)

```mermaid
classDiagram
    class Department {
        +string name
        +string code
        +number order
        +string? managerId
        +string? parentDepartmentId
        +string externalId
        +Date externalCreatedAt
        +Date externalUpdatedAt
        +Date? lastSyncAt
    }
    
    BaseEntity <|-- Department
    Department "0..1" --> "0..*" Department : 상위부서
```

---

## 핵심 도메인 (Core Domain)

### AnnouncementPopup (공지사항 팝업)

```mermaid
classDiagram
    class AnnouncementPopup {
        +AnnouncementStatus status
        +string title
        +boolean isPublic
        +AnnouncementCategory category
        +Language language
        +Tag[] tags
        +Employee manager
        +string[] attachments
        +Date? releasedAt
        ---
        +공개한다() void
        +비공개한다() void
        +상태를_변경한다(status) void
    }
    
    BaseEntity <|-- AnnouncementPopup
    AnnouncementPopup --> Employee
    AnnouncementPopup --> Language
    AnnouncementPopup --> Category
    AnnouncementPopup --> Tag
    AnnouncementPopup --> ContentStatus
```

### Announcement (공지사항)

```mermaid
classDiagram
    class Announcement {
        +string title
        +string content
        +boolean isFixed
        +AnnouncementCategory category
        +Date? releasedAt
        +Date? expiredAt
        +boolean mustRead
        +Employee manager
        +AnnouncementStatus status
        +number hits
        +string[] attachments
        +AnnouncementEmployee[] employees
        ---
        +조회수를_증가한다() void
        +직원이_읽음_처리한다(employeeId) void
        +직원이_응답을_제출한다(employeeId, message) void
        +상태를_변경한다(status) void
    }
    
    class AnnouncementEmployee {
        +string id
        +string name
        +boolean isRead
        +boolean isSubmitted
        +Date? submittedAt
        +Date? readAt
        +string? responseMessage
    }
    
    BaseEntity <|-- Announcement
    Announcement --> Employee
    Announcement --> Category
    Announcement --> ContentStatus
    Announcement *-- AnnouncementEmployee
```

### ShareholdersMeeting (주주총회)

```mermaid
classDiagram
    class ShareholdersMeeting {
        +ResultOfVote resultOfVote
        +string title
        +string resultText
        +string summary
        +Language language
        +ShareholdersMeetingCategory category
        +boolean isPublic
        +string location
        +Date meetingDate
        +Employee manager
        +Date? releasedAt
        +string[] attachments
        +Tag[] tags
        ---
        +공개한다() void
        +비공개한다() void
    }
    
    class ResultOfVote {
        +string title
        +number totalVote
        +number yesVote
        +number noVote
        +number approvalRating
        +string result
    }
    
    BaseEntity <|-- ShareholdersMeeting
    ShareholdersMeeting --> Employee
    ShareholdersMeeting --> Language
    ShareholdersMeeting --> Category
    ShareholdersMeeting --> Tag
    ShareholdersMeeting *-- ResultOfVote
```

### ElectronicDisclosure (전자공시)

```mermaid
classDiagram
    class ElectronicDisclosure {
        +string title
        +Employee manager
        +Language language
        +ElectronicDisclosureCategory category
        +boolean isPublic
        +ElectronicDisclosureStatus status
        +Tag[] tags
    }
    
    BaseEntity <|-- ElectronicDisclosure
    ElectronicDisclosure --> Employee
    ElectronicDisclosure --> Language
    ElectronicDisclosure --> Category
    ElectronicDisclosure --> Tag
    ElectronicDisclosure --> ContentStatus
```

### IR (투자자 관계)

```mermaid
classDiagram
    class IR {
        +string title
        +Employee manager
        +Language language
        +IRCategory category
        +boolean isPublic
        +IRStatus status
        +Tag[] tags
    }
    
    BaseEntity <|-- IR
    IR --> Employee
    IR --> Language
    IR --> Category
    IR --> Tag
    IR --> ContentStatus
```

### Brochure (브로슈어)

```mermaid
classDiagram
    class Brochure {
        +string title
        +Employee manager
        +Language language
        +BrochureCategory category
        +boolean isPublic
        +BrochureStatus status
        +Tag[] tags
    }
    
    BaseEntity <|-- Brochure
    Brochure --> Employee
    Brochure --> Language
    Brochure --> Category
    Brochure --> Tag
    Brochure --> ContentStatus
```

### News (뉴스)

```mermaid
classDiagram
    class News {
        +string title
        +Employee manager
        +NewsCategory category
        +boolean isPublic
        +NewsStatus status
        +Tag[] tags
    }
    
    BaseEntity <|-- News
    News --> Employee
    News --> Category
    News --> Tag
    News --> ContentStatus
```

---

## 부가 도메인 (Sub Domain)

### LumirStory (루미르 스토리)

```mermaid
classDiagram
    class LumirStory {
        +string title
        +Employee manager
        +LumirStoryCategory category
        +boolean isPublic
        +LumirStoryStatus status
        +Tag[] tags
    }
    
    BaseEntity <|-- LumirStory
    LumirStory --> Employee
    LumirStory --> Category
    LumirStory --> Tag
    LumirStory --> ContentStatus
```

### VideoGallery (비디오 갤러리)

```mermaid
classDiagram
    class VideoGallery {
        +string title
        +Employee manager
        +VideoGalleryCategory category
        +boolean isPublic
        +VideoGalleryStatus status
        +Tag[] tags
    }
    
    BaseEntity <|-- VideoGallery
    VideoGallery --> Employee
    VideoGallery --> Category
    VideoGallery --> Tag
    VideoGallery --> ContentStatus
```

### Survey (설문조사)

```mermaid
classDiagram
    class Survey {
        +string title
        +SurveyCategory category
        +Employee manager
        +string description
        +Inquery[] inqueries
        +SurveyStatus status
        ---
        +질문을_추가한다(inquery) void
        +질문을_제거한다(inqueryId) void
        +공개한다() void
        +비공개한다() void
        +상태를_변경한다(status) void
    }
    
    class Inquery {
        +string id
        +string title
        +InqueryType type
        +InqueryFormData form
        +boolean isRequired
        +InqueryResponse[] responses
    }
    
    class InqueryType {
        <<enumeration>>
        SHORT_ANSWER
        PARAGRAPH
        MULTIPLE_CHOICE
        DROPDOWN
        CHECKBOXES
        FILE_UPLOAD
        DATETIME
        LINEAR_SCALE
        GRID_SCALE
    }
    
    class InqueryResponse {
        +Employee employee
        +InqueryResponseData response
    }
    
    BaseEntity <|-- Survey
    Survey --> Employee
    Survey --> Category
    Survey --> ContentStatus
    Survey *-- Inquery
    Inquery *-- InqueryResponse
    Inquery --> InqueryType
    InqueryResponse --> Employee
```

### EducationManagement (교육 관리)

```mermaid
classDiagram
    class EducationManagement {
        +string title
        +string content
        +boolean isPublic
        +Attendee[] attendees
        +Date deadline
        +string[] attachments
        +Employee manager
    }
    
    class Attendee {
        +string id
        +string name
        +AttendeeStatus status
        +Date? completedAt
        +Date deadline
    }
    
    class AttendeeStatus {
        <<enumeration>>
        PENDING : "대기중"
        IN_PROGRESS : "진행중"
        COMPLETED : "완료"
        OVERDUE : "기한 초과"
    }
    
    BaseEntity <|-- EducationManagement
    EducationManagement --> Employee
    EducationManagement *-- Attendee
    Attendee --> AttendeeStatus
```

### Wiki (위키)

```mermaid
classDiagram
    class Wiki {
        +string title
        +string content
        +WikiFileSystem fileSystem
        +boolean isPublic
        +string ownerId
        +string[] tags
        ---
        +공개한다() void
        +비공개한다() void
        +태그를_추가한다(tag) void
        +태그를_제거한다(tag) void
    }
    
    class WikiFileSystem {
        +string id
        +string name
        +WikiFileSystemType type
        +string? parentId
        +WikiFileSystem[]? children
        +Date updatedAt
        +Date createdAt
        +boolean visibility
        +string ownerId
    }
    
    class WikiFileSystemType {
        <<enumeration>>
        FOLDER
        FILE
    }
    
    BaseEntity <|-- Wiki
    Wiki *-- WikiFileSystem
    WikiFileSystem --> WikiFileSystemType
    WikiFileSystem "0..1" --> "0..*" WikiFileSystem : 하위항목
```

---

## 관계 다이어그램

### 전체 엔티티 관계도 (ERD)

```mermaid
erDiagram
    %% ============================================
    %% Common Domain (공통 도메인)
    %% ============================================
    
    EMPLOYEE {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        string employee_number UK "직원 번호"
        string name "직원명"
        string email UK "이메일"
        string phone_number "전화번호"
        date date_of_birth "생년월일"
        enum gender "MALE|FEMALE"
        date hire_date "입사일"
        string manager_id "매니저 ID"
        enum status "재직중|휴직중|퇴사"
        string department_id FK "부서 ID"
        string department_name "부서명"
        string department_code "부서 코드"
        string position_id "직급 ID"
        string rank_id "직책 ID"
        string rank_name "직책명"
        string rank_code "직책 코드"
        int rank_level "직책 레벨"
        string external_id UK "외부 시스템 ID"
        timestamp external_created_at "외부 생성일"
        timestamp external_updated_at "외부 수정일"
        timestamp last_sync_at "마지막 동기화"
        jsonb roles "역할 목록"
        boolean is_excluded_from_list "목록 제외"
        string exclude_reason "제외 사유"
        string excluded_by "제외 설정자"
        timestamp excluded_at "제외 일시"
        boolean is_accessible "접근 가능"
    }

    DEPARTMENT {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        string name "부서명"
        string code "부서 코드"
        int order "정렬 순서"
        string manager_id "매니저 ID"
        string parent_department_id FK "상위 부서 ID"
        string external_id UK "외부 시스템 ID"
        timestamp external_created_at "외부 생성일"
        timestamp external_updated_at "외부 수정일"
        timestamp last_sync_at "마지막 동기화"
    }

    %% ============================================
    %% Core Domain - 공지사항 팝업
    %% ============================================
    
    ANNOUNCEMENT_POPUP {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        enum status "draft|approved|under_review|rejected|opened"
        string title "제목 (최대 500자)"
        boolean is_public "공개 여부"
        jsonb category "카테고리"
        jsonb language "언어"
        jsonb tags "태그 목록"
        uuid manager_id FK "관리자 ID"
        text[] attachments "첨부파일 URL"
        timestamp released_at "공개 일시"
    }

    %% ============================================
    %% Core Domain - 공지사항
    %% ============================================
    
    ANNOUNCEMENT {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        string title "제목 (최대 500자)"
        text content "내용"
        boolean is_fixed "상단 고정"
        jsonb category "카테고리"
        timestamp released_at "공개 일시"
        timestamp expired_at "만료 일시"
        boolean must_read "필독 여부"
        uuid manager_id FK "관리자 ID"
        enum status "draft|approved|under_review|rejected|opened"
        int hits "조회수"
        text[] attachments "첨부파일 URL"
        jsonb employees "대상 직원 목록"
    }

    ANNOUNCEMENT_EMPLOYEE {
        string id "직원 ID"
        string name "직원명"
        boolean is_read "읽음 여부"
        boolean is_submitted "제출 여부"
        timestamp submitted_at "제출 일시"
        timestamp read_at "읽음 일시"
        string response_message "응답 메시지"
    }

    %% ============================================
    %% Core Domain - 주주총회
    %% ============================================
    
    SHAREHOLDERS_MEETING {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        jsonb result_of_vote "의결 결과"
        string title "제목 (최대 500자)"
        text result_text "결과 텍스트"
        text summary "요약"
        jsonb language "언어"
        jsonb category "카테고리"
        boolean is_public "공개 여부"
        string location "장소 (최대 500자)"
        timestamp meeting_date "회의 일시"
        uuid manager_id FK "관리자 ID"
        timestamp released_at "공개 일시"
        text[] attachments "첨부파일 URL"
        jsonb tags "태그 목록"
    }

    RESULT_OF_VOTE {
        string title "안건 제목"
        int total_vote "총 투표수"
        int yes_vote "찬성표"
        int no_vote "반대표"
        decimal approval_rating "승인율"
        enum result "accepted|rejected"
    }

    %% ============================================
    %% Core Domain - 전자공시, IR, 브로슈어, 뉴스
    %% ============================================
    
    ELECTRONIC_DISCLOSURE {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        string title "제목"
        uuid manager_id FK "관리자 ID"
        jsonb language "언어"
        jsonb category "카테고리"
        boolean is_public "공개 여부"
        enum status "draft|approved|under_review|rejected|opened"
        jsonb tags "태그 목록"
    }

    IR {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        string title "제목"
        uuid manager_id FK "관리자 ID"
        jsonb language "언어"
        jsonb category "카테고리"
        boolean is_public "공개 여부"
        enum status "draft|approved|under_review|rejected|opened"
        jsonb tags "태그 목록"
    }

    BROCHURE {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        string title "제목"
        uuid manager_id FK "관리자 ID"
        jsonb language "언어"
        jsonb category "카테고리"
        boolean is_public "공개 여부"
        enum status "draft|approved|under_review|rejected|opened"
        jsonb tags "태그 목록"
    }

    NEWS {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        string title "제목"
        uuid manager_id FK "관리자 ID"
        jsonb category "카테고리"
        boolean is_public "공개 여부"
        enum status "draft|approved|under_review|rejected|opened"
        jsonb tags "태그 목록"
    }

    %% ============================================
    %% Sub Domain - 루미르 스토리, 비디오 갤러리
    %% ============================================
    
    LUMIR_STORY {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        string title "제목"
        uuid manager_id FK "관리자 ID"
        jsonb category "카테고리"
        boolean is_public "공개 여부"
        enum status "draft|approved|under_review|rejected|opened"
        jsonb tags "태그 목록"
    }

    VIDEO_GALLERY {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        string title "제목"
        uuid manager_id FK "관리자 ID"
        jsonb category "카테고리"
        boolean is_public "공개 여부"
        enum status "draft|approved|under_review|rejected|opened"
        jsonb tags "태그 목록"
    }

    %% ============================================
    %% Sub Domain - 설문조사
    %% ============================================
    
    SURVEY {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        string title "제목 (최대 500자)"
        jsonb category "카테고리"
        uuid manager_id FK "관리자 ID"
        text description "설명"
        jsonb inqueries "질문 목록"
        enum status "draft|approved|under_review|rejected|opened"
    }

    INQUERY {
        string id "질문 ID"
        string title "질문 제목"
        enum type "질문 타입"
        jsonb form "질문 폼 데이터"
        boolean is_required "필수 여부"
        jsonb responses "응답 목록"
    }

    INQUERY_RESPONSE {
        string employee_id "응답 직원 ID"
        string employee_name "응답 직원명"
        jsonb response "응답 데이터"
    }

    %% ============================================
    %% Sub Domain - 교육 관리
    %% ============================================
    
    EDUCATION_MANAGEMENT {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        string title "제목"
        text content "내용"
        boolean is_public "공개 여부"
        jsonb attendees "수강생 목록"
        timestamp deadline "마감 일시"
        text[] attachments "첨부파일 URL"
        uuid manager_id FK "관리자 ID"
    }

    ATTENDEE {
        string id "수강생 ID"
        string name "수강생명"
        enum status "pending|in_progress|completed|overdue"
        timestamp completed_at "완료 일시"
        timestamp deadline "마감 일시"
    }

    %% ============================================
    %% Sub Domain - 위키
    %% ============================================
    
    WIKI {
        uuid id PK
        timestamp created_at
        timestamp updated_at
        timestamp deleted_at
        string created_by
        string updated_by
        int version
        string title "제목 (최대 500자)"
        text content "내용"
        jsonb file_system "파일 시스템 구조"
        boolean is_public "공개 여부"
        string owner_id "소유자 ID"
        text[] tags "태그 목록"
    }

    WIKI_FILE_SYSTEM {
        string id "파일/폴더 ID"
        string name "이름"
        enum type "folder|file"
        string parent_id "상위 폴더 ID"
        jsonb children "하위 항목"
        timestamp updated_at "수정 일시"
        timestamp created_at "생성 일시"
        boolean visibility "공개 여부"
        string owner_id "소유자 ID"
    }

    %% ============================================
    %% 관계 정의
    %% ============================================
    
    %% Department 관계
    DEPARTMENT ||--o{ DEPARTMENT : "parent-child"
    DEPARTMENT ||--o{ EMPLOYEE : "belongs to"

    %% Employee 관리 관계
    EMPLOYEE ||--o{ ANNOUNCEMENT_POPUP : "manages"
    EMPLOYEE ||--o{ ANNOUNCEMENT : "manages"
    EMPLOYEE ||--o{ SHAREHOLDERS_MEETING : "manages"
    EMPLOYEE ||--o{ ELECTRONIC_DISCLOSURE : "manages"
    EMPLOYEE ||--o{ IR : "manages"
    EMPLOYEE ||--o{ BROCHURE : "manages"
    EMPLOYEE ||--o{ NEWS : "manages"
    EMPLOYEE ||--o{ LUMIR_STORY : "manages"
    EMPLOYEE ||--o{ VIDEO_GALLERY : "manages"
    EMPLOYEE ||--o{ SURVEY : "manages"
    EMPLOYEE ||--o{ EDUCATION_MANAGEMENT : "manages"

    %% 공지사항 관계
    ANNOUNCEMENT ||--o{ ANNOUNCEMENT_EMPLOYEE : "targets"

    %% 주주총회 관계
    SHAREHOLDERS_MEETING ||--|| RESULT_OF_VOTE : "has vote result"

    %% 설문조사 관계
    SURVEY ||--o{ INQUERY : "contains"
    INQUERY ||--o{ INQUERY_RESPONSE : "has responses"

    %% 교육 관리 관계
    EDUCATION_MANAGEMENT ||--o{ ATTENDEE : "has attendees"

    %% 위키 관계
    WIKI ||--|| WIKI_FILE_SYSTEM : "has file system"
    WIKI_FILE_SYSTEM ||--o{ WIKI_FILE_SYSTEM : "parent-child"
```

### 공통 타입 사용 관계

```mermaid
graph TD
    Language[Language 언어]
    Category[Category 카테고리]
    Tag[Tag 태그]
    Status[ContentStatus 상태]
    
    Language --> AnnouncementPopup
    Language --> ShareholdersMeeting
    Language --> ElectronicDisclosure
    Language --> IR
    Language --> Brochure
    
    Category --> AnnouncementPopup
    Category --> Announcement
    Category --> ShareholdersMeeting
    Category --> ElectronicDisclosure
    Category --> IR
    Category --> Brochure
    Category --> News
    Category --> LumirStory
    Category --> VideoGallery
    Category --> Survey
    
    Tag --> AnnouncementPopup
    Tag --> ShareholdersMeeting
    Tag --> ElectronicDisclosure
    Tag --> IR
    Tag --> Brochure
    Tag --> News
    Tag --> LumirStory
    Tag --> VideoGallery
    
    Status --> AnnouncementPopup
    Status --> Announcement
    Status --> ElectronicDisclosure
    Status --> IR
    Status --> Brochure
    Status --> News
    Status --> LumirStory
    Status --> VideoGallery
    Status --> Survey
```

---

## 데이터베이스 스키마

### 공통 필드 (모든 테이블)

모든 엔티티는 `BaseEntity`를 상속받아 다음 필드를 공통으로 포함합니다:

| 필드명 | 타입 | NULL | 설명 |
|--------|------|------|------|
| id | UUID | NO | 기본키 |
| created_at | TIMESTAMP | NO | 생성 일시 |
| updated_at | TIMESTAMP | NO | 수정 일시 |
| deleted_at | TIMESTAMP | YES | 삭제 일시 (Soft Delete) |
| created_by | VARCHAR | YES | 생성자 ID |
| updated_by | VARCHAR | YES | 수정자 ID |
| version | INTEGER | NO | 낙관적 락 버전 |

### 테이블 목록

#### Common Domain
- `employee` - 직원
- `department` - 부서

#### Core Domain
- `announcement_popup` - 공지사항 팝업
- `announcement` - 공지사항
- `shareholders_meeting` - 주주총회
- `electronic_disclosure` - 전자공시
- `ir` - 투자자 관계
- `brochure` - 브로슈어
- `news` - 뉴스

#### Sub Domain
- `lumir_story` - 루미르 스토리
- `video_gallery` - 비디오 갤러리
- `survey` - 설문조사
- `education_management` - 교육 관리
- `wiki` - 위키

### JSONB 필드 사용

다음 필드들은 PostgreSQL의 JSONB 타입으로 저장됩니다:

- `category` (Category)
- `language` (Language)
- `tags` (Tag[])
- `resultOfVote` (ResultOfVote)
- `employees` (AnnouncementEmployee[])
- `inqueries` (Inquery[])
- `attendees` (Attendee[])
- `fileSystem` (WikiFileSystem)

### 외래키 관계

```sql
-- 대부분의 엔티티가 Employee를 참조
ALTER TABLE announcement_popup 
  ADD CONSTRAINT fk_announcement_popup_manager 
  FOREIGN KEY (manager_id) REFERENCES employee(id);

ALTER TABLE announcement 
  ADD CONSTRAINT fk_announcement_manager 
  FOREIGN KEY (manager_id) REFERENCES employee(id);

-- Department의 자기 참조
ALTER TABLE department 
  ADD CONSTRAINT fk_department_parent 
  FOREIGN KEY (parent_department_id) REFERENCES department(external_id);
```

### 인덱스

```sql
-- Employee 고유 인덱스
CREATE UNIQUE INDEX idx_employee_external_id ON employee(external_id);
CREATE UNIQUE INDEX idx_employee_number ON employee(employee_number);
CREATE UNIQUE INDEX idx_employee_email ON employee(email);

-- Department 고유 인덱스
CREATE UNIQUE INDEX idx_department_external_id ON department(external_id);

-- 성능 최적화 인덱스
CREATE INDEX idx_announcement_status ON announcement(status);
CREATE INDEX idx_announcement_released_at ON announcement(released_at);
CREATE INDEX idx_employee_department_id ON employee(department_id);
CREATE INDEX idx_department_parent_id ON department(parent_department_id);
```

---

## 엔티티 특성 요약

### 공통 패턴

1. **BaseEntity 상속**
   - 모든 엔티티는 `BaseEntity<T>`를 상속
   - 공통 메타데이터 필드 포함
   - `DTO로_변환한다()` 메서드 구현

2. **Employee 참조**
   - 대부분의 엔티티가 `manager: Employee` 필드 보유
   - ManyToOne 관계로 매핑

3. **JSONB 활용**
   - Category, Language, Tag 등은 JSONB로 저장
   - 유연한 구조 변경 가능
   - PostgreSQL의 JSONB 인덱싱 활용

4. **Soft Delete**
   - `deletedAt` 필드로 소프트 삭제 지원
   - 물리적 삭제 대신 논리적 삭제

5. **낙관적 락**
   - `version` 필드로 동시성 제어
   - TypeORM의 @VersionColumn 사용

### 도메인별 특징

#### Core Domain (핵심 비즈니스)
- 다국어 지원 (Language)
- 카테고리 분류 (Category)
- 태그 시스템 (Tag)
- 상태 관리 (ContentStatus)
- 공개/비공개 제어 (isPublic)
- 첨부파일 지원 (attachments)

#### Sub Domain (부가 기능)
- Survey: 복잡한 질문-응답 구조
- Wiki: 계층적 파일 시스템
- EducationManagement: 진행률 추적
- 상태 관리는 선택적

---

## 향후 확장 고려사항

### 다국어 지원 강화
- Translation 테이블 분리
- 각 언어별 번역 데이터 관리

### 파일 관리
- Attachment 엔티티 분리
- S3 메타데이터 관리
- 파일 버전 관리

### 권한 관리
- Role Based Access Control (RBAC)
- Permission 엔티티 추가
- Employee-Role-Permission 관계

### 이력 관리
- Audit Log 테이블
- 변경 이력 추적
- 버전 관리 시스템

### 검색 최적화
- Full-Text Search 인덱스
- Elasticsearch 연동
- 태그 기반 검색 강화

---

**문서 작성**: 2025-01-06  
**작성자**: Lumir CMS Backend Team  
**버전**: 1.0.0
