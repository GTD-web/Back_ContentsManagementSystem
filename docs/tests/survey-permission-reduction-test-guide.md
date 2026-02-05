# 설문 응답 자동 삭제 기능 테스트 가이드

> 📍 **위치**: `docs/tests/survey-permission-reduction-test-guide.md`  
> 📅 **작성일**: 2026-02-05  
> 🎯 **목적**: 공지사항 권한 축소 시 제거된 사용자의 설문 응답 자동 Soft Delete 기능 테스트

---

## ✅ 구현 완료 사항

### 1. **Soft Delete 구현**
- `SurveyCompletion`: ✅ Soft Delete
- `SurveyResponseText`: ✅ Soft Delete
- `SurveyResponseChoice`: ✅ Soft Delete
- `SurveyResponseScale`: ✅ Soft Delete
- `SurveyResponseGrid`: ✅ Soft Delete
- `SurveyResponseFile`: ✅ Soft Delete
- `SurveyResponseDatetime`: ✅ Soft Delete
- `SurveyResponseCheckbox`: ⚠️ Hard Delete만 지원 (엔티티 구조상)

### 2. **권한 축소 감지 및 자동 삭제**
공지사항 수정 시 자동으로:
- 이전 권한과 새 권한 비교
- 제거된 직원 ID 추출
- 해당 직원들의 설문 응답 Soft Delete

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

**2. 권한 축소 (employee-2, employee-3 제거)**
```json
PUT /api/cms/office/announcement/:id
{
  "permissionEmployeeIds": [
    "employee-1",
    "employee-4"
  ]
}
```

**3. 예상 결과**
- ✅ `employee-2`, `employee-3`의 모든 설문 응답에 `deletedAt` 설정됨
- ✅ 로그: "권한 축소 감지 - 2명의 직원 권한 제거됨"
- ✅ 로그: "제거된 직원들의 설문 응답 삭제 완료 - N개 레코드"

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
-- 삭제된 응답 확인
SELECT * FROM survey_completions 
WHERE "employeeNumber" IN ('employee-2', 'employee-3')
AND "deletedAt" IS NOT NULL;

-- 삭제된 텍스트 응답 확인
SELECT * FROM survey_response_texts
WHERE "employeeNumber" IN ('employee-2', 'employee-3')
AND "deletedAt" IS NOT NULL;
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
✅ "권한 축소 감지 - N명의 직원 권한 제거됨"
✅ "설문 응답 삭제 시작 - 설문 ID: xxx, 대상 직원: N명"
✅ "제거된 직원들의 설문 응답 삭제 완료 - N개 레코드"
```

---

## ⚠️ 주의사항

### 현재 지원
- ✅ `permissionEmployeeIds` 변경 감지 및 응답 삭제

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

- [ ] 특정 직원 권한 제거 시 해당 직원 응답만 삭제되는지 확인
- [ ] 다른 직원 응답은 영향 없는지 확인
- [ ] `deletedAt`이 제대로 설정되는지 확인
- [ ] 설문조사가 없는 공지사항에서도 에러 없이 작동하는지 확인
- [ ] 로그가 제대로 출력되는지 확인
- [ ] `isPublic: true` 변경 시 응답 삭제 안 되는지 확인

---

**구현 완료!** 🎉
권한 축소 시 제거된 사용자의 설문 응답이 자동으로 Soft Delete 처리됩니다.
