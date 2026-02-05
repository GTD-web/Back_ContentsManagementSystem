# AWS S3 파일 경로 구조 개선

## 개요
공지사항 및 설문조사 파일 업로드 시 AWS S3에 저장되는 파일 경로를 더 구체적이고 직관적으로 개선했습니다. 이제 AWS 콘솔에서 파일을 쉽게 찾고 관리할 수 있습니다.

## 변경된 파일 경로 구조

### 1. 공지사항 첨부파일
```
[공지사항명]/업로드파일들/[파일명]_[타임스탬프].[확장자]
```

**예시:**
```
신년도_OKR_워크샵_안내/업로드파일들/워크샵_일정표_1738762800000.pdf
신년도_OKR_워크샵_안내/업로드파일들/참고자료_1738762801000.xlsx
```

### 2. 설문조사 응답 파일
```
[공지사항명]/[질문명]/[사용자명]/[파일명]_[타임스탬프].[확장자]
```

**예시:**
```
신년도_OKR_워크샵_안내/워크샵_참여_소감을_첨부해주세요/홍길동/소감문_1738762900000.pdf
신년도_OKR_워크샵_안내/워크샵_참여_소감을_첨부해주세요/김철수/후기_1738762901000.docx
```

## 주요 개선사항

### 1. 경로 가독성
- **이전**: `announcements/a27b0d00-f21b-4e77-afe8-995af4ceaa40.pdf`
- **개선**: `신년도_OKR_워크샵_안내/업로드파일들/워크샵_일정표_1738762800000.pdf`

AWS 콘솔에서 폴더 구조를 탐색하여 어떤 공지사항의 어떤 파일인지 바로 확인 가능합니다.

### 2. 설문조사 응답 관리
- **질문별 분류**: 각 질문에 대한 응답 파일이 별도 폴더에 저장
- **사용자별 분류**: 동일한 질문에 대한 여러 사용자의 응답이 사용자별로 구분
- **추적 용이성**: 누가 어떤 질문에 어떤 파일을 첨부했는지 즉시 파악 가능

### 3. 파일명 안전성
- 특수문자, 공백 자동 처리 (언더스코어로 변환)
- 타임스탬프 추가로 동일 파일명 중복 방지
- 최대 100자 제한으로 파일시스템 호환성 보장

## 기술 구현

### 1. FileUploadService 신규 메서드

#### `uploadFileWithPath()`
```typescript
async uploadFileWithPath(
  file: Express.Multer.File,
  pathSegments: string[],
): Promise<{ fileName, fileUrl, fileSize, mimeType }>
```
- 경로 세그먼트 배열을 받아 구조화된 경로 생성
- 특수문자 자동 sanitize 처리
- 타임스탬프 추가로 파일명 고유성 보장

#### `uploadFilesWithPath()`
```typescript
async uploadFilesWithPath(
  files: Express.Multer.File[],
  pathSegments: string[],
): Promise<Array<{ fileName, fileUrl, fileSize, mimeType }>>
```
- 여러 파일을 동일한 경로에 일괄 업로드

#### `sanitizePathSegment()` (private)
- 슬래시, 백슬래시 제거
- Windows 특수문자 변환
- 공백 → 언더스코어
- 연속된 언더스코어 제거
- 최대 100자 제한

### 2. 컨트롤러 수정

#### 관리자 - 공지사항 생성 (`POST /admin/announcements`)
```typescript
const pathSegments = [announcementTitle, '업로드파일들'];
attachments = await this.fileUploadService.uploadFilesWithPath(files, pathSegments);
```

#### 관리자 - 공지사항 수정 (`PUT /admin/announcements/:id`)
```typescript
const announcementTitle = parsedDto.title || existingAnnouncement.title || '제목없음';
const pathSegments = [announcementTitle, '업로드파일들'];
attachments = await this.fileUploadService.uploadFilesWithPath(files, pathSegments);
```

#### 사용자 - 설문조사 응답 제출 (`POST /user/announcements/:id/survey/answers`)
```typescript
const announcementTitle = announcement.title || '제목없음';
const questionTitle = question?.title || '질문';
const userName = user.name || user.employeeNumber || '사용자';

const pathSegments = [announcementTitle, questionTitle, userName];
const uploadedFiles = await this.fileUploadService.uploadFilesWithPath(
  questionFiles,
  pathSegments,
);
```

## 영향 범위

### 수정된 파일
1. `src/domain/common/file-upload/file-upload.service.ts`
   - 신규 메서드 추가: `uploadFileWithPath()`, `uploadFilesWithPath()`
   - private 메서드 추가: `sanitizePathSegment()`
   - 기존 메서드 유지 (하위 호환성 보장)

2. `src/interface/admin/announcement/announcement.controller.ts`
   - `공지사항을_생성한다()` 메서드 수정
   - `공지사항을_수정한다()` 메서드 수정

3. `src/interface/user/announcement/announcement.controller.ts`
   - `공지사항_설문에_응답한다()` 메서드 수정

### 하위 호환성
- 기존 `uploadFile()`, `uploadFiles()` 메서드는 그대로 유지
- 다른 모듈에서 기존 메서드를 사용하는 경우 영향 없음
- 새로운 파일만 개선된 경로로 저장됨

## 테스트 시나리오

### 1. 공지사항 생성 테스트
1. 관리자 페이지에서 새 공지사항 생성
2. 파일 첨부 (PDF, 이미지 등)
3. AWS S3 콘솔에서 경로 확인:
   - `[공지사항명]/업로드파일들/[파일명]_[타임스탬프].[확장자]`

### 2. 공지사항 수정 테스트
1. 기존 공지사항 수정
2. 새 파일 첨부
3. AWS S3 콘솔에서 경로 확인:
   - 새 파일이 올바른 경로에 저장되었는지 확인

### 3. 설문조사 응답 테스트
1. 사용자가 설문조사 응답 (파일 첨부 질문 포함)
2. 여러 사용자가 동일한 질문에 응답
3. AWS S3 콘솔에서 경로 확인:
   - `[공지사항명]/[질문명]/[사용자명]/[파일명]_[타임스탬프].[확장자]`
   - 각 사용자별로 폴더가 분리되어 있는지 확인

### 4. 특수문자 테스트
1. 제목에 특수문자 포함된 공지사항 생성 (예: "2024년 1/4분기 실적 (최종)")
2. 파일 업로드 후 경로 확인:
   - 특수문자가 안전하게 변환되었는지 확인
   - 예: `2024년_1_4분기_실적_최종_/업로드파일들/...`

## 주의사항

1. **기존 파일**: 이미 업로드된 파일의 경로는 변경되지 않습니다.
2. **URL 변경 없음**: 파일 URL 구조는 동일하며, 경로만 변경됩니다.
3. **DB 영향 없음**: 데이터베이스 스키마 변경 없습니다.
4. **성능**: 파일 업로드 성능에 영향 없습니다.

## 향후 개선 가능 사항

1. **경로 템플릿 설정**: 관리자가 경로 구조를 설정 가능하도록 개선
2. **폴더 정리**: 오래된 파일 자동 정리 기능
3. **파일명 검증**: 추가적인 파일명 검증 규칙
4. **로깅 강화**: 파일 업로드 경로 로그 상세화

## 롤백 방법

변경사항을 롤백하려면:
1. 컨트롤러에서 `uploadFilesWithPath()` → `uploadFiles()` 로 변경
2. 경로 관련 코드 제거
3. 기존 메서드는 그대로 유지되므로 롤백 시 영향 없음

---

**작성일**: 2026-02-05
**작성자**: AI Assistant
