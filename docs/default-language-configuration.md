# 기본 언어 설정 가이드

## 개요

루미르 CMS 백엔드 어플리케이션에서 기본 언어를 설정할 수 있습니다. 이 설정은 다음 항목에 영향을 미칩니다:

- 번역 동기화 기준 언어
- 목록 조회 시 기본 표시 언어
- 콘텐츠 생성 시 기준 언어
- 시드 데이터 생성 시 기본 언어

## 환경 변수 설정

### .env 파일 설정

`.env` 파일에 다음 환경 변수를 추가하세요:

```env
# 기본 언어 설정
# 백엔드 어플리케이션의 기본 언어 코드 (ko, en, ja, zh 중 선택)
# 이 설정은 번역 동기화 및 기본 표시 언어로 사용됩니다
DEFAULT_LANGUAGE_CODE=en
```

### 지원 언어 코드

| 코드 | 언어   | 설명         |
|------|--------|--------------|
| `ko` | 한국어 | Korean       |
| `en` | 영어   | English      |
| `ja` | 일본어 | Japanese     |
| `zh` | 중국어 | Chinese      |

### 기본값

환경 변수가 설정되지 않았거나 잘못된 값이 설정된 경우, 기본값은 `en` (영어)입니다.

## 영향을 받는 기능

### 1. 번역 동기화

모든 콘텐츠의 번역 동기화는 기본 언어를 기준으로 수행됩니다:

- **브로슈어** - `isSynced=true`인 번역들이 기본 언어의 내용으로 자동 동기화
- **전자공시** - 기본 언어 원본을 기준으로 다른 언어 번역 동기화
- **IR** - 기본 언어를 기준으로 번역 동기화
- **메인 팝업** - 기본 언어 기준 동기화
- **주주총회** - 주주총회 및 의결 결과 번역 동기화

### 2. 목록 조회

콘텐츠 목록 조회 시 기본 언어의 번역을 우선적으로 표시합니다:

- 기본 언어 번역이 없는 경우, 첫 번째 번역을 표시
- Business Layer에서 DTO 변환 시 적용

### 3. 콘텐츠 생성

새로운 콘텐츠 생성 시 기본 언어를 기준으로 합니다:

- 브로슈어 생성 시 기본 언어 번역 우선 선택
- 다른 언어 번역 자동 생성 시 기본 언어 내용 복사

### 4. 시드 데이터

시드 데이터 생성 시 기본 언어로 초기 데이터를 생성합니다.

### 5. 언어 삭제 제한

기본 언어로 설정된 언어는 삭제할 수 없습니다.

## 변경 방법

### 1. .env 파일 수정

```bash
# .env 파일 편집
DEFAULT_LANGUAGE_CODE=ko  # 한국어로 변경
```

### 2. 애플리케이션 재시작

```bash
# 개발 환경
npm run start:dev

# 프로덕션 환경
npm run start:prod
```

## 주의사항

### 변경 시 고려사항

1. **기존 데이터**: 기본 언어 변경 후에도 기존 데이터는 영향을 받지 않습니다.
2. **동기화 작업**: 번역 동기화 스케줄러는 다음 실행 시점부터 새로운 기본 언어를 사용합니다.
3. **언어 존재 여부**: 변경하려는 언어가 데이터베이스에 존재하는지 확인하세요.

### 권장사항

1. 프로덕션 환경에서는 언어 변경 전에 충분한 테스트를 수행하세요.
2. 언어 변경 후 번역 동기화가 정상적으로 작동하는지 확인하세요.
3. 기본 언어 변경은 비즈니스 요구사항에 따라 신중히 결정하세요.
4. 테스트 환경에서도 `DEFAULT_LANGUAGE_CODE`를 설정하여 실제 운영 환경과 동일한 조건에서 테스트하세요.

## 코드 구조

### ConfigService 사용

기본 언어 설정은 NestJS의 ConfigService를 통해 사용합니다:

```typescript
// 생성자에서 ConfigService 주입
constructor(
  // ... 다른 의존성들
  private readonly configService: ConfigService,
) {}

// 환경 변수 조회
const defaultLanguageCode = this.configService.get<string>('DEFAULT_LANGUAGE_CODE', 'en');
```

### LanguageService

기본 언어를 조회하는 메서드를 제공합니다:

```typescript
async 기본_언어를_조회한다(): Promise<Language> {
  const defaultCode = this.configService.get<string>('DEFAULT_LANGUAGE_CODE', 'en') as LanguageCode;
  return await this.코드로_언어를_조회한다(defaultCode);
}
```

## 테스트 환경 설정

테스트 파일에서도 동일한 환경 변수를 사용하므로, 테스트 환경의 `.env` 또는 테스트 설정에서 `DEFAULT_LANGUAGE_CODE`를 설정하세요.

```typescript
// 테스트 파일에서는 환경 변수가 자동으로 적용됨
// 별도 설정이 필요한 경우 process.env.DEFAULT_LANGUAGE_CODE를 설정
```

## 문제 해결

### 잘못된 언어 코드 설정

**증상**: 기본 언어를 찾을 수 없다는 로그 메시지 표시

**해결**: `.env` 파일에서 `DEFAULT_LANGUAGE_CODE`를 올바른 값(`ko`, `en`, `ja`, `zh`)으로 수정

### 기본 언어를 찾을 수 없음

**증상**: 번역 동기화나 콘텐츠 조회 시 오류 발생

**해결**: 
1. 데이터베이스에 해당 언어가 존재하는지 확인
2. 언어 초기화 API를 실행하여 기본 언어 추가

```bash
POST /api/admin/languages/initialize
```

## 참고 자료

- [다국어 전략 문서](./.cursor/multilingual-strategy.mdc)
- [언어 코드 타입 정의](./src/domain/common/language/language-code.types.ts)
- [언어 서비스](./src/domain/common/language/language.service.ts)
