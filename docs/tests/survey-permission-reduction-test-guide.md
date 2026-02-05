# 설문 응답 자동 삭제 기능 테스트 가이드

> 📍 **위치**: `docs/tests/survey-permission-reduction-test-guide.md`  
> 📅 **작성일**: 2026-02-05  
> 🎯 **목적**: 공지사항 권한 축소 시 제거된 사용자의 설문 응답 자동 Soft Delete 기능 테스트

---

## ✅ 구현 완료 사항

### 1. **Soft Delete 구현 (데이터 소실 방지)**
- `AnnouncementRead`: ✅ Soft Delete (읽음 기록)
- `SurveyCompletion`: ✅ Soft Delete
- `SurveyResponseText`: ✅ Soft Delete + 복구
- `SurveyResponseChoice`: ✅ Soft Delete + 복구
- `SurveyResponseCheckbox`: ✅ Soft Delete + 복구 (마이그레이션 완료)
- `SurveyResponseScale`: ✅ Soft Delete + 복구
- `SurveyResponseGrid`: ✅ Soft Delete + 복구
- `SurveyResponseFile`: ✅ Soft Delete + 복구
- `SurveyResponseDatetime`: ✅ Soft Delete + 복구

### 2. **권한 축소 감지 및 자동 삭제**
공지사항 수정 시 자동으로:
- 이전 권한과 새 권한 비교
- 제거된 직원 ID 추출
- 해당 직원들의 **읽음 기록** Soft Delete
- 해당 직원들의 **설문 응답** Soft Delete

### 3. **질문 개별 변경 감지 및 응답 삭제**
설문조사 질문 수정 시 자동으로:
- 각 질문을 개별적으로 비교 (title, type, form, isRequired)
- 변경된 질문만 감지하여 해당 질문의 응답만 Soft Delete
- 변경되지 않은 질문의 응답은 유지
- **장점**: 질문 하나만 수정해도 다른 질문의 응답은 영향 없음

**변경 감지 기준**:
- 질문 제목 변경
- 질문 타입 변경 (단문형 → 선택형 등)
- 질문 form 변경 (선택지, 척도 범위 등)
- 필수 여부 변경

### 4. **재추가 시 자동 복구 (프로덕션 데이터 보호)**
제거된 사용자를 다시 권한에 추가하면:
- 공지사항 수정 API 호출 시 **즉시 자동 복구**
  - `announcement_reads`: 이전 읽음 기록 복구 (`deletedAt = NULL`)
  - `survey_completions`: 이전 설문 완료 기록 복구
  - 모든 `survey_response_*`: 이전 응답 데이터 복구
- **사용자 액션 불필요**: 다시 읽거나 제출할 필요 없음
- **데이터 이력 완전 보존**: ID, 생성시간 모두 유지

---

## 📋 테스트 방법

### 시나리오 1: 특정 직원 권한 제거

**1. 초기 설정**
```json
PUT /api/cms/office/announcement/:id
{
  "permissionEmployeeIds": [
    "employee-1",
    "employee-2",
    "employee-3",
    "employee-4"
  ]
}
```

**2. 사용자들이 공지사항 읽고 설문 제출**
- employee-1, employee-2, employee-3 모두 설문 완료

**3. 권한 축소 (employee-2, employee-3 제거)**
```json
PUT /api/cms/office/announcement/:id
{
  "permissionEmployeeIds": [
    "employee-1",
    "employee-4"
  ]
}
```

**4. 예상 결과 (권한 축소)**
- ✅ `employee-2`, `employee-3`의 모든 읽음 기록에 `deletedAt` 설정됨
- ✅ `employee-2`, `employee-3`의 모든 설문 응답에 `deletedAt` 설정됨
- ✅ 로그: "권한 축소 감지 - 2명의 직원 권한 제거됨"
- ✅ 로그: "제거된 직원들의 읽음 기록 삭제 완료 - N개 레코드"
- ✅ 로그: "제거된 직원들의 설문 응답 삭제 완료 - N개 레코드"

---

### 시나리오 1-1: 제거된 직원 재추가 및 복구 확인

**1. 제거된 직원 다시 추가**
```json
PUT /api/cms/office/announcement/:id
{
  "permissionEmployeeIds": [
    "employee-1",
    "employee-2",  // 다시 추가
    "employee-4"
  ]
}
```

**2. 예상 결과 (자동 복구 - API 호출 시)**
- ✅ 로그: "권한 확대 감지 - 1명의 직원 권한 추가됨"
- ✅ 읽음 기록 자동 복구: `deletedAt = NULL` (즉시)
- ✅ 설문 응답 자동 복구: 모든 응답 레코드 `deletedAt = NULL` (즉시)
- ✅ 로그: "추가된 직원들의 읽음 기록 복구 완료 - N개 레코드"
- ✅ 로그: "추가된 직원들의 설문 응답 복구 완료 - N개 레코드"

**3. 사용자 확인 (즉시 반영)**
- employee-2가 공지사항 목록 조회
- **결과**: 읽음 ✅, 설문 완료 ✅ (이전 상태 그대로 복원)
- **사용자가 다시 읽거나 제출할 필요 없음**

**4. DB 확인 (데이터 이력 유지)**
```sql
-- 읽음 기록 복구 확인
SELECT "id", "createdAt", "deletedAt", "readAt" 
FROM announcement_reads
WHERE "announcementId" = '공지사항ID'
AND "employeeId" = 'employee-2-uuid';
-- deletedAt = NULL, 기존 id/createdAt/readAt 모두 유지

-- 설문 완료 복구 확인
SELECT "id", "createdAt", "deletedAt", "isCompleted", "completedAt"
FROM survey_completions
WHERE "surveyId" = '설문ID'
AND "employeeNumber" = 'employee-2';
-- deletedAt = NULL, 기존 id/createdAt/completedAt 모두 유지

-- 응답 데이터 복구 확인
SELECT "id", "createdAt", "deletedAt", "textValue"
FROM survey_response_texts
WHERE "questionId" = '질문ID'
AND "employeeNumber" = 'employee-2';
-- deletedAt = NULL, 응답 내용과 모든 이력 유지
```

---

### 시나리오 4: 질문 개별 수정 시 해당 질문 응답만 삭제

**1. 초기 설정: 3개 질문이 있는 설문조사**
```json
{
  "questions": [
    { "id": "q1", "title": "이름", "type": "text", "order": 1 },
    { "id": "q2", "title": "만족도", "type": "choice", "order": 2 },
    { "id": "q3", "title": "의견", "type": "textarea", "order": 3 }
  ]
}
```

**2. 사용자들이 설문 제출**
- employee-1이 모든 질문에 답변 완료

**3. Q2 질문만 수정 (만족도 → 추천도)**
```json
{
  "questions": [
    { "id": "q1", "title": "이름", "type": "text", "order": 1 },
    { "id": "q2", "title": "추천도", "type": "choice", "order": 2 },  // 제목 변경
    { "id": "q3", "title": "의견", "type": "textarea", "order": 3 }
  ]
}
```

**4. 예상 결과**
- ✅ Q2의 응답만 `deletedAt` 설정됨
- ✅ Q1, Q3의 응답은 그대로 유지됨
- ✅ 로그: "질문 변경 감지 - \"만족도\" → 해당 질문의 응답 삭제 예정"
- ✅ 로그: "질문 응답 삭제 완료 - 질문 ID: q2, 삭제된 레코드: N개"

**5. DB 확인**
```sql
-- Q2 응답만 삭제되었는지 확인
SELECT "questionId", "deletedAt" 
FROM survey_response_choice
WHERE "employeeNumber" = 'employee-1'
ORDER BY "questionId";

-- 예상 결과:
-- q1: deletedAt = NULL (유지)
-- q2: deletedAt = 2026-02-05... (삭제됨)
-- q3: deletedAt = NULL (유지)
```

---

### 시나리오 5: 질문 타입 변경

**1. 질문 타입 변경 (선택형 → 척도형)**
```json
{
  "questions": [
    { "id": "q2", "title": "만족도", "type": "linear_scale", "form": { "min": 1, "max": 5 }, "order": 2 }
  ]
}
```

**2. 예상 결과**
- ✅ 타입이 변경되었으므로 기존 `choice` 응답 삭제
- ✅ 새로운 `linear_scale` 응답 받을 준비됨

---

### 시나리오 6: 질문 선택지 변경

**1. 선택지 변경**
```json
{
  "questions": [
    { 
      "id": "q2", 
      "title": "만족도", 
      "type": "choice",
      "form": {
        "options": ["매우 불만", "불만", "보통", "만족", "매우 만족"]  // 변경됨
      },
      "order": 2 
    }
  ]
}
```

**2. 예상 결과**
- ✅ `form` 내용이 변경되었으므로 기존 응답 삭제
- ✅ 사용자는 새로운 선택지로 다시 제출해야 함

---

### 시나리오 2: 모든 권한 제거

```json
PUT /api/cms/office/announcement/:id
{
  "permissionEmployeeIds": null
}
```

**예상 결과**
- ✅ 모든 직원의 설문 응답 Soft Delete

---

### 시나리오 3: 전사 공개로 변경

```json
PUT /api/cms/office/announcement/:id
{
  "isPublic": true
}
```

**예상 결과**
- ✅ 권한 축소 로직 스킵 (전사 공개이므로)
- ✅ 기존 응답 유지

---

## 🔍 DB에서 확인하는 방법

### 1. Soft Delete 확인
```sql
-- 삭제된 읽음 기록 확인
SELECT * FROM announcement_reads
WHERE "announcementId" = '공지사항ID'
AND "deletedAt" IS NOT NULL
ORDER BY "deletedAt" DESC;

-- 삭제된 설문 완료 기록 확인
SELECT * FROM survey_completions 
WHERE "employeeNumber" IN ('employee-2', 'employee-3')
AND "deletedAt" IS NOT NULL;

-- 삭제된 텍스트 응답 확인
SELECT * FROM survey_response_texts
WHERE "employeeNumber" IN ('employee-2', 'employee-3')
AND "deletedAt" IS NOT NULL;
```

### 2. 통계에서 제외 확인
```sql
-- 활성 응답만 조회 (통계 집계 방식)
SELECT * FROM survey_completions 
WHERE "surveyId" = '설문ID'
AND "deletedAt" IS NULL;

-- 질문별 응답 조회 (통계 집계 방식)
SELECT * FROM survey_response_choice
WHERE "questionId" = '질문ID'
AND "deletedAt" IS NULL;
```

### 3. 재추가 후 복구 확인
```sql
-- 읽음 기록 복구 확인
SELECT "employeeId", "deletedAt", "readAt" 
FROM announcement_reads
WHERE "announcementId" = '공지사항ID'
AND "employeeId" = 'employee-2-uuid';

-- 설문 완료 복구 확인
SELECT "employeeNumber", "deletedAt", "isCompleted", "completedAt"
FROM survey_completions
WHERE "surveyId" = '설문ID'
AND "employeeNumber" = 'employee-2';

-- 응답 레코드 복구 확인 (ID 유지 확인)
SELECT "id", "deletedAt", "textValue", "submittedAt"
FROM survey_response_texts
WHERE "questionId" = '질문ID'
AND "employeeNumber" = 'employee-2';
-- 제거 전 ID와 재제출 후 ID가 동일해야 함 (복구됨)
```

### 4. 데이터 이력 유지 확인
```sql
-- 응답 레코드의 생성 시간과 ID 확인
SELECT "id", "createdAt", "updatedAt", "deletedAt", "submittedAt"
FROM survey_response_choice
WHERE "employeeNumber" = 'employee-2'
ORDER BY "createdAt";
-- createdAt은 유지, updatedAt과 submittedAt만 변경됨
```

### 5. 질문 개별 수정 후 응답 삭제 확인
```sql
-- 특정 질문의 응답만 삭제되었는지 확인
SELECT "questionId", "deletedAt", "createdAt"
FROM survey_response_choice
WHERE "employeeNumber" = 'employee-1'
ORDER BY "questionId";

-- 예상 결과:
-- 변경된 질문의 응답만 deletedAt이 설정됨
-- 다른 질문들의 응답은 deletedAt = NULL로 유지

-- 특정 질문 ID로 삭제 여부 확인
SELECT COUNT(*) as total,
       COUNT(CASE WHEN "deletedAt" IS NULL THEN 1 END) as active,
       COUNT(CASE WHEN "deletedAt" IS NOT NULL THEN 1 END) as deleted
FROM survey_response_texts
WHERE "questionId" = 'q2';
-- 해당 질문의 응답이 모두 soft delete되었는지 확인
```

### 2. 삭제 전후 비교
```sql
-- 삭제 전
SELECT COUNT(*) FROM survey_completions WHERE "deletedAt" IS NULL;

-- 권한 축소 실행

-- 삭제 후
SELECT COUNT(*) FROM survey_completions WHERE "deletedAt" IS NULL;
```

---

## 📝 로그 확인

서버 로그에서 다음 메시지 확인:

```
# 권한 제거 시
✅ "권한 축소 감지 - N명의 직원 권한 제거됨"
✅ "제거된 직원들의 읽음 기록 삭제 완료 - N개 레코드"
✅ "설문 응답 삭제 시작 - 설문 ID: xxx, 대상 직원: N명"
✅ "제거된 직원들의 설문 응답 삭제 완료 - N개 레코드"

# 권한 재추가 시 (자동 복구)
✅ "권한 확대 감지 - N명의 직원 권한 추가됨"
✅ "추가된 직원들의 읽음 기록 복구 완료 - N개 레코드"
✅ "이전 응답 기록이 있는 사번 N개: xxx, yyy"
✅ "추가된 직원들의 설문 응답 복구 완료 - N개 레코드"

# 질문 수정 시 (개별 질문 응답 삭제)
✅ "질문 변경 감지 - \"[이전 제목]\" → 해당 질문의 응답 삭제 예정"
✅ "질문 응답 삭제 시작 - 질문 ID: xxx"
✅ "질문 응답 삭제 완료 - 질문 ID: xxx, 삭제된 레코드: N개"
```

---

## ⚠️ 주의사항

### 현재 지원
- ✅ `permissionEmployeeIds` 변경 감지 및 응답 삭제
- ✅ **모든 응답 타입 Soft Delete 복구** (checkbox 제외)
- ✅ **데이터 이력 유지** (레코드 ID 변경 없음)

### 프로덕션 데이터 보호
- 📊 **응답 레코드 ID 유지**: 재제출 시 새 레코드 생성 대신 기존 레코드 복구
- 🕐 **생성 시간 보존**: `createdAt` 필드는 최초 생성 시간 유지
- 🔄 **업데이트 이력**: `updatedAt`과 `submittedAt`만 갱신
- 💾 **데이터 소실 방지**: Soft Delete로 실수로 삭제된 데이터도 복구 가능

### 향후 추가 필요
- ⏳ `permissionDepartmentIds` 변경 시 해당 부서 직원 응답 삭제
- ⏳ `permissionRankIds` 변경 시 해당 직급 직원 응답 삭제
- ⏳ `permissionPositionIds` 변경 시 해당 직책 직원 응답 삭제

**이유**: 부서/직급/직책 ID로 직원 목록을 조회하려면 SSO API 연동 필요

---

## 🔄 복구 방법

Soft Delete이므로 필요 시 복구 가능:

```sql
-- 특정 직원 응답 복구
UPDATE survey_completions
SET "deletedAt" = NULL
WHERE "employeeNumber" = 'employee-2';

UPDATE survey_response_texts
SET "deletedAt" = NULL
WHERE "employeeNumber" = 'employee-2';

-- ... (다른 응답 테이블도 동일)
```

---

## 🎯 테스트 체크리스트

- [ ] 특정 직원 권한 제거 시 해당 직원 **읽음 기록**만 삭제되는지 확인
- [ ] 특정 직원 권한 제거 시 해당 직원 **설문 응답**만 삭제되는지 확인
- [ ] 다른 직원 응답은 영향 없는지 확인
- [ ] `deletedAt`이 제대로 설정되는지 확인
- [ ] 설문 통계에서 삭제된 응답이 제외되는지 확인 (`totalCompletions` 감소 확인)
- [ ] **재추가 시 자동 복구 확인** (API 호출 시 즉시)
  - [ ] 읽음 기록 자동 복구 (`deletedAt = NULL`)
  - [ ] 설문 응답 자동 복구 (`deletedAt = NULL`)
  - [ ] 사용자가 다시 읽거나 제출하지 않아도 즉시 반영됨
- [ ] **응답 레코드 ID 유지 확인** (복구 시 새 레코드 생성 안됨)
- [ ] **`createdAt` 시간 보존 확인** (최초 생성 시간 유지)
- [ ] **질문 개별 수정 시 해당 질문 응답만 삭제**
  - [ ] 질문 제목만 변경 시 해당 질문 응답만 삭제
  - [ ] 질문 타입 변경 시 해당 질문 응답만 삭제
  - [ ] 질문 선택지 변경 시 해당 질문 응답만 삭제
  - [ ] 변경되지 않은 다른 질문들의 응답은 유지됨
  - [ ] 로그: "질문 변경 감지 - \"[제목]\" → 해당 질문의 응답 삭제 예정"
  - [ ] 로그: "질문 응답 삭제 완료 - 질문 ID: xxx, 삭제된 레코드: N개"
- [ ] 설문조사가 없는 공지사항에서도 에러 없이 작동하는지 확인
- [ ] 로그가 제대로 출력되는지 확인
- [ ] `isPublic: true` 변경 시 응답 삭제/복구 안 되는지 확인

---

**구현 완료!** 🎉

권한 축소 시 제거된 사용자의 설문 응답이 자동으로 Soft Delete 처리되며,  
재추가 시 **즉시 자동으로** 기존 응답 레코드를 복구하여 프로덕션 데이터를 안전하게 보호합니다.

**질문 수정 시에는 변경된 질문의 응답만 선택적으로 Soft Delete되어, 다른 질문들의 응답은 보존됩니다.**

### 🔐 프로덕션 안전성
- ✅ 레코드 ID 유지 (외래 키 무결성 보장)
- ✅ 생성 시간 보존 (데이터 이력 추적 가능)
- ✅ Soft Delete (실수 복구 가능)
- ✅ **자동 복구** (사용자 액션 불필요)
- ✅ **질문별 세분화된 응답 관리** (불필요한 데이터 삭제 방지)

### ⚡ 사용자 경험
- ✅ 권한 재추가 시 **즉시 이전 상태로 복원**
- ✅ 다시 읽거나 제출할 필요 없음
- ✅ 설문 응답 덮어쓰기 가능 (원하면 재제출 가능)
- ✅ 질문 수정 시 다른 질문의 응답은 영향 없음
