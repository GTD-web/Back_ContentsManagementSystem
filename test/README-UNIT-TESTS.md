# Unit 테스트 가이드

## 📋 개요

이 문서는 공지사항 관련 unit 테스트의 구조와 실행 방법을 설명합니다.

## 🏗️ 테스트 구조

### 디렉토리 구조

```
test/
├── business/                      # Business Layer 테스트
│   └── announcement-business/
│       └── announcement-business.service.spec.ts
├── context/                       # Context Layer 테스트
│   └── announcement-context/
│       ├── announcement-context.service.spec.ts
│       └── handlers/
│           └── create-announcement.handler.spec.ts
├── domain/                        # Domain Layer 테스트 (향후 추가)
│   └── .gitkeep
└── interface/                     # Interface Layer (E2E 테스트)
    └── admin/
        └── announcement/
            ├── post-announcement.e2e-spec.ts
            ├── get-announcements.e2e-spec.ts
            ├── update-delete-announcement.e2e-spec.ts
            ├── batch-order-announcement.e2e-spec.ts
            ├── announcement-category.e2e-spec.ts
            └── announcement-notification.e2e-spec.ts
```

## 🧪 작성된 테스트

### 1. Business Layer (11개 테스트)

**파일**: `test/business/announcement-business/announcement-business.service.spec.ts`

#### AnnouncementBusinessService
- ✅ 공지사항_목록을_조회한다
- ✅ 공지사항_전체_목록을_조회한다
- ✅ 공지사항을_조회한다
- ✅ 공지사항을_생성한다
- ✅ 공지사항을_수정한다
- ✅ 공지사항_공개를_수정한다
- ✅ 공지사항_고정을_수정한다
- ✅ 공지사항을_삭제한다
- ✅ 공지사항_오더를_일괄_수정한다
- ✅ 공지사항_카테고리_목록을_조회한다
- ✅ 공지사항_카테고리를_생성한다

**특징**:
- 비즈니스 로직의 오케스트레이션 테스트
- Mock 객체를 사용하여 의존성 격리
- Context 서비스와 Category 서비스 호출 검증

### 2. Context Layer (13개 테스트)

#### AnnouncementContextService (10개 테스트)
**파일**: `test/context/announcement-context/announcement-context.service.spec.ts`

- ✅ 공지사항을_생성한다 - CreateAnnouncementCommand 실행
- ✅ 공지사항을_수정한다 - UpdateAnnouncementCommand 실행
- ✅ 공지사항_공개를_수정한다 - UpdateAnnouncementPublicCommand 실행
- ✅ 공지사항_고정을_수정한다 - UpdateAnnouncementFixedCommand 실행
- ✅ 공지사항_오더를_수정한다 - UpdateAnnouncementOrderCommand 실행
- ✅ 공지사항_오더를_일괄_수정한다 - UpdateAnnouncementBatchOrderCommand 실행
- ✅ 공지사항을_삭제한다 - DeleteAnnouncementCommand 실행
- ✅ 공지사항_목록을_조회한다 - GetAnnouncementListQuery 실행
- ✅ 공지사항_목록을_조회한다 (선택적 파라미터 없이)
- ✅ 공지사항을_조회한다 - GetAnnouncementDetailQuery 실행

**특징**:
- CQRS CommandBus/QueryBus 사용 검증
- Command/Query 패턴 테스트

#### CreateAnnouncementHandler (3개 테스트)
**파일**: `test/context/announcement-context/handlers/create-announcement.handler.spec.ts`

- ✅ 기본 공지사항 생성
- ✅ 첨부파일이 있는 공지사항 생성
- ✅ 권한 정보가 있는 공지사항 생성

**특징**:
- CQRS Command Handler 테스트
- AnnouncementService 호출 검증

## 🚀 테스트 실행

### 전체 Unit 테스트 실행

```bash
npm run test
```

### 공지사항 관련 테스트만 실행

```bash
npm run test -- --testPathPatterns="announcement"
```

### Business Layer 테스트만 실행

```bash
npm run test -- test/business/announcement-business/
```

### Context Layer 테스트만 실행

```bash
npm run test -- test/context/announcement-context/
```

### 특정 파일 테스트 실행

```bash
npm run test -- test/business/announcement-business/announcement-business.service.spec.ts
```

### Watch 모드로 실행

```bash
npm run test:watch
```

### Coverage 포함 실행

```bash
npm run test:cov
```

## 📊 테스트 결과

```
Test Suites: 3 passed, 3 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        2.76 s
```

### Coverage (예상)

- **Business Layer**: 
  - AnnouncementBusinessService: 주요 메서드 100% 커버
  - 카테고리 관련 메서드 포함

- **Context Layer**: 
  - AnnouncementContextService: 모든 Command/Query 실행 커버
  - CreateAnnouncementHandler: 다양한 생성 시나리오 커버

## 🔧 Mock 전략

### Business Layer
- **AnnouncementContextService**: Mock으로 대체
- **CompanyContextService**: Mock으로 대체
- **CategoryService**: Mock으로 대체
- **ConfigService**: Mock으로 대체
- **Repository**: Mock으로 대체

### Context Layer
- **CommandBus**: Mock으로 대체
- **QueryBus**: Mock으로 대체
- **AnnouncementService**: Mock으로 대체

## 📝 테스트 작성 가이드

### 1. Business Layer 테스트

```typescript
describe('ServiceName', () => {
  let service: ServiceName;
  let dependencyService: jest.Mocked<DependencyService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ServiceName,
        { provide: DependencyService, useValue: mockDependencyService },
      ],
    }).compile();

    service = module.get<ServiceName>(ServiceName);
    dependencyService = module.get(DependencyService);
  });

  it('should call dependency service correctly', async () => {
    // Given
    const input = { /* ... */ };
    mockDependencyService.method.mockResolvedValue(expectedResult);

    // When
    const result = await service.method(input);

    // Then
    expect(dependencyService.method).toHaveBeenCalledWith(input);
    expect(result).toEqual(expectedResult);
  });
});
```

### 2. Context Layer 테스트

```typescript
describe('HandlerName', () => {
  let handler: HandlerName;
  let service: jest.Mocked<ServiceName>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        HandlerName,
        { provide: ServiceName, useValue: mockService },
      ],
    }).compile();

    handler = module.get<HandlerName>(HandlerName);
    service = module.get(ServiceName);
  });

  it('should execute command correctly', async () => {
    // Given
    const command = new Command(data);
    mockService.method.mockResolvedValue(expectedResult);

    // When
    const result = await handler.execute(command);

    // Then
    expect(service.method).toHaveBeenCalledWith(
      expect.objectContaining({ /* expected fields */ })
    );
    expect(result).toMatchObject(expectedResult);
  });
});
```

## 🎯 테스트 원칙

1. **격리 (Isolation)**: 각 테스트는 독립적으로 실행
2. **Mock 사용**: 외부 의존성은 Mock으로 대체
3. **명확한 Given-When-Then**: 테스트 구조를 명확하게
4. **의미있는 이름**: 테스트 케이스 이름은 한글로 명확하게
5. **실제 구현 검증**: Mock 호출과 반환값을 모두 검증

## 📚 참고 자료

- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest 공식 문서](https://jestjs.io/docs/getting-started)
- [CQRS 패턴](https://docs.nestjs.com/recipes/cqrs)

## 🔄 향후 계획

- [ ] Domain Layer 테스트 추가
- [ ] 나머지 Context Handler 테스트 추가
- [ ] Integration 테스트 추가 (필요시)
- [ ] Coverage 목표: 80% 이상

---

> 💡 **팁**: Unit 테스트는 빠른 피드백을 제공합니다. 코드 변경 후 바로 실행하여 회귀를 방지하세요.
