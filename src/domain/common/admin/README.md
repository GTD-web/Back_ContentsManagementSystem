# Admin 도메인

CMS 백엔드 API 접근이 허용된 사번 목록을 관리합니다.

## 개요

Admin 테이블은 CMS 백엔드 API에 접근할 수 있는 사용자를 관리합니다. 
토큰에 포함된 사번(employeeNumber)이 이 테이블에 등록되어 있고 활성화 상태인 경우에만 API 사용이 가능합니다.

## 주요 기능

- **사번 기반 접근 제어**: SSO 토큰의 사번으로 접근 권한 확인
- **관리자 목록 관리**: Admin 추가, 조회, 활성화/비활성화, 삭제
- **소프트 삭제**: 삭제된 관리자 정보도 DB에 보관

## Admin 테이블 구조

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | uuid | 고유 식별자 |
| employeeNumber | varchar(50) | 사번 (고유값) |
| name | varchar(200) | 관리자 이름 (선택) |
| email | varchar(200) | 관리자 이메일 (선택) |
| isActive | boolean | 활성화 여부 |
| notes | text | 비고 (선택) |
| createdAt | timestamp | 생성 일시 |
| updatedAt | timestamp | 수정 일시 |
| deletedAt | timestamp | 삭제 일시 |

## 관리자 추가 방법

### 방법 1: API 엔드포인트 사용 (권장)

이미 Admin 테이블에 등록된 관리자가 API를 통해 새로운 관리자를 추가할 수 있습니다.

**엔드포인트**: `POST /admin/management/admins`

**요청 예시**:
```bash
curl -X POST http://localhost:3000/admin/management/admins \
  -H "Authorization: Bearer {your_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "employeeNumber": "EMP001",
    "name": "홍길동",
    "email": "hong@example.com",
    "notes": "CMS 백엔드 관리자"
  }'
```

Swagger UI에서도 테스트 가능: `http://localhost:3000/api#/공통.%20관리자%20관리`

### 방법 2: 데이터베이스 직접 접근

최초 관리자를 추가하거나 API 접근이 불가능한 경우, pgAdmin 등의 DB 클라이언트로 직접 추가할 수 있습니다.

**SQL 예시**:
```sql
INSERT INTO admins (
  id, 
  "employeeNumber", 
  name, 
  email, 
  "isActive", 
  notes,
  "createdAt",
  "updatedAt",
  version
) VALUES (
  gen_random_uuid(),
  'EMP001',
  '홍길동',
  'hong@example.com',
  true,
  '최초 관리자',
  NOW(),
  NOW(),
  1
);
```

## 관리자 조회

**엔드포인트**: `GET /admin/management/admins`

모든 관리자 목록을 조회합니다.

## 관리자 비활성화

**엔드포인트**: `PATCH /admin/management/admins/{id}/status`

**요청 예시**:
```json
{
  "isActive": false
}
```

## 관리자 삭제

**엔드포인트**: `DELETE /admin/management/admins/{id}`

소프트 삭제되어 `deletedAt`이 설정됩니다.

## AdminGuard

`AdminGuard`는 전역 가드로 설정되어 있으며, `@Public()` 데코레이터가 없는 모든 엔드포인트에 자동으로 적용됩니다.

### 인증 흐름

1. `JwtAuthGuard`: 토큰 검증 및 사용자 정보 추출
2. `AdminGuard`: 사번이 Admin 테이블에 있고 활성화 상태인지 확인
3. 권한이 있으면 API 접근 허용, 없으면 403 Forbidden

### @Public() 데코레이터

다음 엔드포인트는 `@Public()` 데코레이터로 AdminGuard를 우회합니다:
- `POST /admin/auth/login`: 로그인 (Swagger 테스트용)
- `GET /admin/auth/me`: 사용자 정보 조회 (Swagger 테스트용)

## 주의사항

1. **최초 관리자 추가**: 시스템 최초 사용 시 DB에 직접 접근하여 관리자를 추가해야 합니다.
2. **사번 정확성**: employeeNumber는 SSO 토큰의 employeeNumber와 정확히 일치해야 합니다.
3. **활성화 상태**: isActive가 false인 경우 API 접근이 차단됩니다.
4. **소프트 삭제**: 삭제된 관리자는 DB에서 완전히 제거되지 않으며, deletedAt 필드로 식별됩니다.

## Migration

Admin 테이블은 다음 migration으로 생성됩니다:
- `1738051200000-CreateAdminsTable.ts`

**Migration 실행**:
```bash
npm run migration:run
```
