# Brochure Context 데이터 흐름

## 📋 목차

1. [개요](#1-개요)
2. [도메인 모델](#2-도메인-모델)
3. [Command 흐름](#3-command-흐름)
4. [Query 흐름](#4-query-흐름)
5. [주요 비즈니스 로직](#5-주요-비즈니스-로직)
6. [스케줄러](#6-스케줄러)

---

## 1. 개요

### 1.1 책임

**Brochure Context**는 회사 브로슈어 관리를 담당합니다.

**주요 기능**:
- 브로슈어 생성, 수정, 삭제
- 다국어 번역 관리 (한국어, 영어, 일본어, 중국어)
- 파일 업로드 (PDF, PPT 등)
- 공개/비공개 설정
- 순서 관리 (개별/일괄)
- 번역 동기화 스케줄러
- 기본 브로슈어 초기화

### 1.2 관련 엔티티

**Core Domain**:
- `Brochure` - 브로슈어 (Core)
- `BrochureTranslation` - 브로슈어 번역 (Core)

**Common Domain**:
- `Language` - 언어 (Common)
- `Category` - 카테고리 (Common)
- `CategoryMapping` - 카테고리 매핑 (Common)

### 1.3 핸들러 구성

**Commands (8개)**:
- `CreateBrochureHandler` - 브로슈어 생성
- `UpdateBrochureHandler` - 브로슈어 수정
- `UpdateBrochureFileHandler` - 파일 변경
- `UpdateBrochurePublicHandler` - 공개 상태 변경
- `UpdateBrochureBatchOrderHandler` - 순서 일괄 변경
- `UpdateBrochureTranslationsHandler` - 번역 수정
- `DeleteBrochureHandler` - 브로슈어 삭제
- `InitializeDefaultBrochuresHandler` - 기본 브로슈어 초기화

**Queries (2개)**:
- `GetBrochureListHandler` - 목록 조회
- `GetBrochureDetailHandler` - 상세 조회

**Job Handlers (1개)**:
- `SyncBrochureTranslationsHandler` - 번역 동기화 (스케줄러)

---

## 2. 도메인 모델

### 2.1 Brochure Entity

```typescript
@Entity('brochures')
export class Brochure extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string; // 기본 제목 (한국어)

  @Column({ type: 'text', nullable: true })
  description: string | null; // 기본 설명 (한국어)

  @Column({ type: 'varchar', length: 512, nullable: true })
  fileUrl: string | null; // 파일 URL (PDF, PPT 등)

  @Column({ type: 'bigint', nullable: true })
  fileSize: number | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  mimeType: string | null;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  // 관계
  @OneToMany(() => BrochureTranslation, translation => translation.brochure, {
    cascade: true,
  })
  translations: BrochureTranslation[];
}
```

### 2.2 BrochureTranslation Entity

```typescript
@Entity('brochure_translations')
export class BrochureTranslation extends BaseEntity {
  @Column('uuid')
  brochureId: string;

  @Column('uuid')
  languageId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  fileUrl: string | null; // 언어별 파일 (선택적)

  // 관계
  @ManyToOne(() => Brochure, brochure => brochure.translations, {
    onDelete: 'CASCADE',
  })
  brochure: Brochure;

  @ManyToOne(() => Language)
  language: Language;

  // 복합 유니크 제약
  @Unique(['brochureId', 'languageId'])
}
```

### 2.3 다국어 전략

**Fallback 순서**:
1. 요청 언어 (예: 영어)
2. 한국어 (기본 언어)
3. 영어
4. 사용 가능한 첫 번째 번역

**예시**:
```
요청: 일본어(ja)
1. 일본어 번역 있음? → 일본어 반환
2. 없음 → 한국어 번역 있음? → 한국어 반환
3. 없음 → 영어 번역 있음? → 영어 반환
4. 없음 → 아무 번역이나 반환
```

### 2.4 ERD

```mermaid
erDiagram
    Brochure ||--o{ BrochureTranslation : "has translations"
    BrochureTranslation }o--|| Language : "references"
    Brochure ||--o{ CategoryMapping : "has categories"
    
    Brochure {
        uuid id PK
        varchar title
        text description
        varchar fileUrl
        bigint fileSize
        varchar mimeType
        boolean isPublic
        int order
        timestamp createdAt
        timestamp updatedAt
        timestamp deletedAt
        uuid createdBy
        uuid updatedBy
        int version
    }
    
    BrochureTranslation {
        uuid id PK
        uuid brochureId FK
        uuid languageId FK
        varchar title
        text description
        varchar fileUrl
        timestamp createdAt
        timestamp updatedAt
    }
    
    Language {
        uuid id PK
        varchar code "ko|en|ja|zh"
        varchar name
        boolean isActive
    }
```

---

## 3. Command 흐름

### 3.1 브로슈어 생성 (CreateBrochure)

**흐름 다이어그램**:

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Business
    participant Storage
    participant Context
    participant Handler as Create Handler
    participant Domain as Brochure Service
    participant DB

    Client->>Controller: POST /admin/brochures (multipart)
    Note over Client,Controller: file + { title, description }
    
    Controller->>Business: 생성(file, dto)
    
    Business->>Storage: 파일_업로드(file)
    Storage->>Storage: S3 업로드
    Storage-->>Business: { url, size, mimeType }
    
    Business->>Context: 생성한다(data)
    Context->>Handler: execute(CreateCommand)
    
    Note over Handler: 트랜잭션 시작
    
    Handler->>Handler: 순서 계산 (최대값 + 1)
    
    Handler->>Domain: 생성한다({...data, fileUrl})
    Domain->>DB: INSERT brochures
    DB-->>Domain: brochure
    
    Handler->>Handler: 기본 번역 생성 (한국어)
    Handler->>DB: INSERT brochure_translations
    
    Note over Handler: 트랜잭션 커밋
    
    Handler-->>Context: { brochure, translations }
    Context-->>Business: result
    Business-->>Controller: result
    Controller-->>Client: 201 Created
```

**기본 번역 생성**:

```typescript
@CommandHandler(CreateBrochureCommand)
async execute(command: CreateBrochureCommand) {
  // 1. 브로슈어 생성
  const brochure = await this.brochureService.생성한다({
    title: command.data.title,
    description: command.data.description,
    fileUrl: command.data.fileUrl,
    fileSize: command.data.fileSize,
    mimeType: command.data.mimeType,
    isPublic: command.data.isPublic ?? false,
    order: await this.calculateNextOrder(),
    createdBy: command.data.createdBy,
  });

  // 2. 기본 번역 생성 (한국어)
  const koreanLanguage = await this.languageService.코드로_언어를_조회한다('ko');
  
  await this.translationRepository.save({
    brochureId: brochure.id,
    languageId: koreanLanguage.id,
    title: command.data.title,
    description: command.data.description,
    fileUrl: command.data.fileUrl,
  });

  return { brochure };
}
```

### 3.2 번역 수정 (UpdateBrochureTranslations)

**흐름 다이어그램**:

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Business
    participant Context
    participant Handler as Update Translations Handler
    participant TransRepo as Translation Repository
    participant DB

    Client->>Controller: PATCH /admin/brochures/:id/translations
    Note over Client,Controller: [{ languageCode: 'en',<br/>title: 'Brochure',<br/>description: '...' }]
    
    Controller->>Business: 번역_수정(id, translations)
    Business->>Context: 번역을_수정한다(id, translations)
    Context->>Handler: execute(UpdateTranslationsCommand)
    
    Note over Handler: 트랜잭션 시작
    
    loop 각 번역
        Handler->>TransRepo: findOne({ brochureId, languageId })
        TransRepo-->>Handler: existing or null
        
        alt 기존 번역 있음
            Handler->>TransRepo: update()
        else 새 번역
            Handler->>TransRepo: save() (INSERT)
        end
    end
    
    Note over Handler: 트랜잭션 커밋
    
    Handler-->>Context: success
    Context-->>Business: success
    Business-->>Controller: success
    Controller-->>Client: 200 OK
```

**번역 Upsert 로직**:

```typescript
@CommandHandler(UpdateBrochureTranslationsCommand)
async execute(command: UpdateBrochureTranslationsCommand) {
  const brochure = await this.brochureService.ID로_조회한다(command.id);

  for (const trans of command.data.translations) {
    // 언어 조회
    const language = await this.languageService.코드로_언어를_조회한다(
      trans.languageCode,
    );

    // 기존 번역 확인
    const existing = await this.translationRepository.findOne({
      where: {
        brochureId: command.id,
        languageId: language.id,
      },
    });

    if (existing) {
      // Update
      Object.assign(existing, {
        title: trans.title,
        description: trans.description,
        fileUrl: trans.fileUrl || existing.fileUrl,
      });
      await this.translationRepository.save(existing);
    } else {
      // Insert
      await this.translationRepository.save({
        brochureId: command.id,
        languageId: language.id,
        title: trans.title,
        description: trans.description,
        fileUrl: trans.fileUrl,
      });
    }
  }

  return { success: true };
}
```

### 3.3 파일 변경 (UpdateBrochureFile)

**흐름 다이어그램**:

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Business
    participant Storage
    participant Context
    participant Handler
    participant Domain
    participant DB

    Client->>Controller: PATCH /admin/brochures/:id/file (multipart)
    Controller->>Business: 파일_변경(id, file)
    
    Business->>Storage: 새 파일 업로드
    Storage-->>Business: { url, size, mimeType }
    
    Business->>Context: 파일을_변경한다(id, fileData)
    Context->>Handler: execute(UpdateFileCommand)
    
    Handler->>Domain: 수정한다(id, { fileUrl, fileSize, mimeType })
    Domain->>DB: UPDATE
    
    Note over Business: 기존 파일 삭제 (선택적)
    Business->>Storage: 기존_파일_삭제(oldFileUrl)
    
    Handler-->>Business: updated brochure
    Business-->>Controller: brochure
    Controller-->>Client: 200 OK
```

### 3.4 기본 브로슈어 초기화 (InitializeDefaultBrochures)

**목적**: 
- 시스템 초기 설정 시 기본 브로슈어 생성
- 테스트 데이터 생성

**흐름**:

```mermaid
sequenceDiagram
    participant Admin
    participant Controller
    participant Context
    participant Handler as Initialize Handler
    participant Domain
    participant DB

    Admin->>Controller: POST /admin/brochures/initialize
    Controller->>Context: 기본_브로슈어를_초기화한다()
    Context->>Handler: execute(InitializeCommand)
    
    Note over Handler: 트랜잭션 시작
    
    Handler->>Handler: 기존 브로슈어 확인
    
    alt 이미 있음
        Handler-->>Context: { message: '이미 초기화됨' }
    else 없음
        loop 기본 브로슈어 목록
            Handler->>Domain: 생성한다(defaultData)
            Domain->>DB: INSERT
            
            Handler->>Handler: 다국어 번역 생성
            loop 각 언어 (ko, en, ja, zh)
                Handler->>DB: INSERT translation
            end
        end
    end
    
    Note over Handler: 트랜잭션 커밋
    
    Handler-->>Context: { created: count }
    Context-->>Controller: result
    Controller-->>Admin: 200 OK
```

**기본 브로슈어 데이터**:

```typescript
const DEFAULT_BROCHURES = [
  {
    title: '회사 소개서',
    description: '우리 회사에 대한 전반적인 소개',
    order: 1,
    translations: {
      en: { title: 'Company Profile', description: 'Overview of our company' },
      ja: { title: '会社紹介', description: '会社の概要' },
      zh: { title: '公司简介', description: '公司概况' },
    },
  },
  {
    title: '제품 카탈로그',
    description: '주요 제품 라인업',
    order: 2,
    translations: {
      en: { title: 'Product Catalog', description: 'Main product lineup' },
      ja: { title: '製品カタログ', description: '主要製品' },
      zh: { title: '产品目录', description: '主要产品' },
    },
  },
];
```

---

## 4. Query 흐름

### 4.1 브로슈어 목록 조회 (GetBrochureList)

**흐름 다이어그램**:

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Business
    participant Context
    participant Handler as List Handler
    participant Repo
    participant DB

    Client->>Controller: GET /admin/brochures?lang=en&page=1
    Controller->>Business: 목록_조회(lang, page)
    Business->>Context: 목록을_조회한다(params)
    Context->>Handler: execute(GetListQuery)
    
    Handler->>Repo: QueryBuilder 구성
    Note over Repo: - JOIN translations<br/>- 언어 필터<br/>- 정렬 (order)<br/>- 페이지네이션
    
    Repo->>DB: SELECT with LEFT JOIN
    DB-->>Repo: brochures with translations
    
    Handler->>Handler: Fallback 로직 적용
    Note over Handler: 요청 언어 없으면<br/>기본 언어로 대체
    
    Handler-->>Context: { items, total, page, limit }
    Context-->>Business: result
    Business-->>Controller: result
    Controller-->>Client: 200 OK
```

**다국어 조회 로직**:

```typescript
@QueryHandler(GetBrochureListQuery)
async execute(query: GetBrochureListQuery) {
  // 언어 조회
  const language = await this.languageService.코드로_언어를_조회한다(
    query.languageCode || 'ko',
  );

  // QueryBuilder
  const queryBuilder = this.brochureRepository
    .createQueryBuilder('brochure')
    .leftJoinAndSelect(
      'brochure.translations',
      'translation',
      'translation.languageId = :languageId',
      { languageId: language.id },
    );

  // 필터
  if (query.isPublic !== undefined) {
    queryBuilder.where('brochure.isPublic = :isPublic', { 
      isPublic: query.isPublic 
    });
  }

  // 정렬
  queryBuilder.orderBy('brochure.order', 'DESC');

  // 페이지네이션
  const skip = (query.page - 1) * query.limit;
  queryBuilder.skip(skip).take(query.limit);

  const [items, total] = await queryBuilder.getManyAndCount();

  // Fallback 적용
  const result = items.map(brochure => ({
    ...brochure,
    displayTitle: this.getDisplayTitle(brochure, query.languageCode),
    displayDescription: this.getDisplayDescription(brochure, query.languageCode),
  }));

  return { items: result, total, page: query.page, limit: query.limit };
}

// Fallback 로직
private getDisplayTitle(brochure: Brochure, languageCode: string): string {
  // 1. 요청 언어
  const requestedLang = brochure.translations.find(
    t => t.language.code === languageCode,
  );
  if (requestedLang) return requestedLang.title;

  // 2. 한국어 (기본)
  const korean = brochure.translations.find(t => t.language.code === 'ko');
  if (korean) return korean.title;

  // 3. 영어
  const english = brochure.translations.find(t => t.language.code === 'en');
  if (english) return english.title;

  // 4. 첫 번째 번역
  return brochure.translations[0]?.title || brochure.title;
}
```

### 4.2 브로슈어 상세 조회 (GetBrochureDetail)

**흐름**:

```mermaid
sequenceDiagram
    participant Client
    participant Controller
    participant Business
    participant Context
    participant Handler
    participant Repo
    participant DB

    Client->>Controller: GET /admin/brochures/:id?lang=en
    Controller->>Business: 상세_조회(id, lang)
    Business->>Context: 상세를_조회한다(id, lang)
    Context->>Handler: execute(GetDetailQuery)
    
    Handler->>Repo: findOne with translations
    Repo->>DB: SELECT with JOIN
    DB-->>Repo: brochure with all translations
    
    Handler->>Handler: 모든 번역 포함
    Note over Handler: 관리자는 모든 언어의<br/>번역을 볼 수 있음
    
    Handler-->>Context: brochure
    Context-->>Business: brochure
    Business-->>Controller: brochure
    Controller-->>Client: 200 OK
```

---

## 5. 주요 비즈니스 로직

### 5.1 다국어 Fallback 전략

**전략 흐름**:

```mermaid
flowchart TD
    Start[번역 조회 시작] --> CheckRequested{요청 언어<br/>번역 있음?}
    
    CheckRequested -->|Yes| ReturnRequested[요청 언어 번역 반환]
    CheckRequested -->|No| CheckKorean{한국어<br/>번역 있음?}
    
    CheckKorean -->|Yes| ReturnKorean[한국어 번역 반환]
    CheckKorean -->|No| CheckEnglish{영어<br/>번역 있음?}
    
    CheckEnglish -->|Yes| ReturnEnglish[영어 번역 반환]
    CheckEnglish -->|No| CheckAny{아무 번역이라도<br/>있음?}
    
    CheckAny -->|Yes| ReturnFirst[첫 번째 번역 반환]
    CheckAny -->|No| ReturnBase[기본 필드 반환<br/>brochure.title/description]
    
    ReturnRequested --> End[종료]
    ReturnKorean --> End
    ReturnEnglish --> End
    ReturnFirst --> End
    ReturnBase --> End
```

**코드 구현**:

```typescript
class BrochureTranslationService {
  async getTranslatedBrochure(
    brochure: Brochure,
    languageCode: string,
  ): Promise<TranslatedBrochure> {
    // 1. 요청 언어
    let translation = brochure.translations.find(
      t => t.language.code === languageCode,
    );

    // 2. Fallback: 한국어
    if (!translation) {
      translation = brochure.translations.find(t => t.language.code === 'ko');
    }

    // 3. Fallback: 영어
    if (!translation) {
      translation = brochure.translations.find(t => t.language.code === 'en');
    }

    // 4. Fallback: 첫 번째 번역
    if (!translation && brochure.translations.length > 0) {
      translation = brochure.translations[0];
    }

    // 5. Fallback: 기본 필드
    return {
      id: brochure.id,
      title: translation?.title || brochure.title,
      description: translation?.description || brochure.description,
      fileUrl: translation?.fileUrl || brochure.fileUrl,
      isPublic: brochure.isPublic,
      order: brochure.order,
      languageCode: translation?.language.code || 'ko',
    };
  }
}
```

### 5.2 번역 동기화 로직

**목적**:
- 브로슈어 기본 필드 변경 시 한국어 번역도 자동 동기화
- 데이터 일관성 유지

**동기화 대상**:
- `brochure.title` ↔ `translation[ko].title`
- `brochure.description` ↔ `translation[ko].description`
- `brochure.fileUrl` ↔ `translation[ko].fileUrl`

**흐름**:

```mermaid
flowchart TD
    Start[브로슈어 수정] --> UpdateBrochure[brochure 테이블 UPDATE]
    UpdateBrochure --> CheckKorean{한국어 번역<br/>있음?}
    
    CheckKorean -->|Yes| UpdateKorean[한국어 번역 UPDATE]
    CheckKorean -->|No| CreateKorean[한국어 번역 INSERT]
    
    UpdateKorean --> End[동기화 완료]
    CreateKorean --> End
```

---

## 6. 스케줄러

### 6.1 번역 동기화 스케줄러

**실행 주기**: 매일 새벽 3시

**목적**:
- 브로슈어 기본 필드와 한국어 번역 간 불일치 해소
- 데이터 무결성 보장

**흐름 다이어그램**:

```mermaid
sequenceDiagram
    participant Scheduler as Cron Scheduler
    participant Handler as Sync Handler
    participant BrochureRepo
    participant TransRepo as Translation Repo
    participant DB

    Note over Scheduler: 매일 03:00

    Scheduler->>Handler: execute()
    
    Handler->>BrochureRepo: findAll()
    BrochureRepo->>DB: SELECT all brochures
    DB-->>BrochureRepo: brochures[]
    
    loop 각 브로슈어
        Handler->>TransRepo: findOne(brochureId, languageCode='ko')
        TransRepo->>DB: SELECT korean translation
        
        alt 한국어 번역 있음
            Handler->>Handler: 값 비교
            alt 불일치 발견
                Handler->>TransRepo: update(translation)
                TransRepo->>DB: UPDATE
                Note over Handler: 동기화 로그 기록
            end
        else 한국어 번역 없음
            Handler->>TransRepo: create(translation)
            TransRepo->>DB: INSERT
            Note over Handler: 생성 로그 기록
        end
    end
    
    Handler->>Handler: 통계 집계
    Handler->>Handler: 완료 로그 기록
    
    Handler-->>Scheduler: { synced: n, created: m }
```

**스케줄러 코드**:

```typescript
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BrochureSyncScheduler {
  private readonly logger = new Logger(BrochureSyncScheduler.name);

  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async syncBrochureTranslations() {
    this.logger.log('브로슈어 번역 동기화 시작');

    try {
      const command = new SyncBrochureTranslationsCommand();
      const result = await this.commandBus.execute(command);

      this.logger.log(
        `브로슈어 번역 동기화 완료 - 동기화: ${result.synced}개, 생성: ${result.created}개`,
      );
    } catch (error) {
      this.logger.error('브로슈어 번역 동기화 실패', error.stack);
    }
  }
}
```

**Handler 코드**:

```typescript
@CommandHandler(SyncBrochureTranslationsCommand)
export class SyncBrochureTranslationsHandler {
  async execute(command: SyncBrochureTranslationsCommand) {
    let syncedCount = 0;
    let createdCount = 0;

    // 모든 브로슈어 조회
    const brochures = await this.brochureRepository.find({
      relations: ['translations', 'translations.language'],
    });

    // 한국어 Language
    const koreanLang = await this.languageRepository.findOne({
      where: { code: 'ko' },
    });

    for (const brochure of brochures) {
      // 한국어 번역 찾기
      const koreanTranslation = brochure.translations.find(
        t => t.languageId === koreanLang.id,
      );

      if (koreanTranslation) {
        // 값 비교 및 동기화
        let needsUpdate = false;

        if (koreanTranslation.title !== brochure.title) {
          koreanTranslation.title = brochure.title;
          needsUpdate = true;
        }

        if (koreanTranslation.description !== brochure.description) {
          koreanTranslation.description = brochure.description;
          needsUpdate = true;
        }

        if (koreanTranslation.fileUrl !== brochure.fileUrl) {
          koreanTranslation.fileUrl = brochure.fileUrl;
          needsUpdate = true;
        }

        if (needsUpdate) {
          await this.translationRepository.save(koreanTranslation);
          syncedCount++;
        }
      } else {
        // 한국어 번역 생성
        await this.translationRepository.save({
          brochureId: brochure.id,
          languageId: koreanLang.id,
          title: brochure.title,
          description: brochure.description,
          fileUrl: brochure.fileUrl,
        });
        createdCount++;
      }
    }

    return { synced: syncedCount, created: createdCount };
  }
}
```

---

## 7. 성능 최적화

### 7.1 번역 조회 최적화

**N+1 문제 방지**:

```typescript
// ❌ N+1 발생
const brochures = await this.repository.find();
for (const brochure of brochures) {
  brochure.translations; // 각 브로슈어마다 별도 쿼리
}

// ✅ 해결: relations 사용
const brochures = await this.repository.find({
  relations: ['translations', 'translations.language'],
});
```

### 7.2 인덱스 전략

```sql
-- 기본 조회
CREATE INDEX idx_brochures_is_public ON brochures(is_public);
CREATE INDEX idx_brochures_order ON brochures("order");

-- 번역 조회
CREATE INDEX idx_brochure_translations_brochure_language 
  ON brochure_translations(brochure_id, language_id);
```

### 7.3 캐싱 전략

**대상**:
- 공개 브로슈어 목록 (언어별)

**TTL**: 10분

**무효화**: 브로슈어 생성/수정/삭제 시

---

**문서 생성일**: 2026년 1월 14일  
**버전**: v1.0
