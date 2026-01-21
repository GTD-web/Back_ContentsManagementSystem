# Docker 환경에서 로그인 실패 문제 해결 가이드

## 🔍 문제 원인

로그인 시도는 되지만 완료되지 않는 이유는 **SSO 서버 연결 설정이 없어서**입니다.

### 로그 분석
```
2026-01-21 09:49:07 [Nest] 1  - LOG [AuthContextService] 로그인 시도: woo.changuk@lumir.space
2026-01-21 09:49:07 [Nest] 1  - LOG [LoginHandler] 로그인 시도: woo.changuk@lumir.space
# 이후 아무 메시지 없음 (타임아웃 또는 에러)
```

### 코드 분석

`src/context/auth-context/handlers/commands/login.handler.ts`:

```typescript
constructor(
  private readonly httpService: HttpService,
  private readonly configService: ConfigService,
  private readonly jwtService: JwtService,
) {
  const baseUrl = this.configService.get<string>('SSO_BASE_URL') || '';
  this.ssoBaseUrl = baseUrl.replace(/\/$/, '');
  
  if (!this.ssoBaseUrl) {
    this.logger.warn('SSO_BASE_URL이 설정되지 않았습니다.');
  }
}

async execute(command: LoginCommand): Promise<LoginResult> {
  // SSO 서버에 로그인 요청
  const response = await firstValueFrom(
    this.httpService.post(`${this.ssoBaseUrl}/api/auth/login`, {
      grant_type: 'password',
      email,
      password,
    }),
  );
  // ...
}
```

- `SSO_BASE_URL` 환경 변수가 없으면 빈 문자열로 설정됨
- HTTP 요청이 `http:///api/auth/login` (잘못된 URL)로 가서 실패
- 에러 핸들링에서 타임아웃 또는 연결 거부 발생

## ✅ 해결 방법

### 1. docker-compose.yml에 SSO_BASE_URL 추가 (완료)

```yaml
environment:
  # SSO 인증 설정 (실제 운영 시 SSO 서버 URL로 변경 필요)
  SSO_BASE_URL: http://localhost:3000  # 또는 실제 SSO 서버 URL
```

### 2. 실제 SSO 서버 URL로 변경

프로젝트에 맞는 SSO 서버 URL을 설정하세요:

**옵션 A: SSO 서버가 별도로 있는 경우**
```yaml
SSO_BASE_URL: http://sso.lumir.space
# 또는
SSO_BASE_URL: http://your-sso-server:port
```

**옵션 B: SSO 서버도 Docker Compose로 관리하는 경우**

docker-compose.yml에 SSO 서비스 추가:
```yaml
services:
  sso:
    image: your-sso-image:latest
    container_name: lumir-sso-server
    ports:
      - '3000:3000'
    networks:
      - lumir-cms-network
  
  app:
    environment:
      SSO_BASE_URL: http://sso:3000  # 컨테이너 이름 사용
```

**옵션 C: SSO 서버가 호스트에서 실행 중인 경우 (개발 환경)**
```yaml
SSO_BASE_URL: http://host.docker.internal:3000
```

### 3. 환경에 따른 설정 권장사항

| 환경 | SSO_BASE_URL 설정 |
|------|-------------------|
| 로컬 개발 (SSO 없이 테스트) | 모킹 서버 또는 개발 SSO |
| 로컬 개발 (SSO 있음) | `http://host.docker.internal:3000` |
| 스테이징 | `http://sso-staging.lumir.space` |
| 프로덕션 | `http://sso.lumir.space` |

## 🔧 적용 방법

### 1. docker-compose.yml 수정

```yaml
app:
  environment:
    SSO_BASE_URL: http://your-actual-sso-url  # 실제 URL로 변경
```

### 2. 컨테이너 재시작

```bash
# Windows
docker-run.bat down
docker-run.bat up

# 또는 직접 명령
docker-compose down
docker-compose up -d
```

### 3. 로그 확인

```bash
# Windows
docker-run.bat logs app

# 또는
docker-compose logs -f app
```

**정상 로그:**
```
[Nest] LOG [AuthContextService] 로그인 시도: user@example.com
[Nest] LOG [LoginHandler] 로그인 시도: user@example.com
[Nest] LOG [LoginHandler] 로그인 성공: user@example.com (역할: admin, user)
```

## 🧪 SSO 서버가 없는 경우 테스트 방법

### 옵션 1: Mock SSO 서버 생성

간단한 Express 서버로 모킹:

```javascript
// mock-sso-server.js
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // 간단한 테스트용 인증
  if (email && password) {
    res.json({
      tokenType: 'Bearer',
      accessToken: 'mock-access-token',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      refreshToken: 'mock-refresh-token',
      refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
      id: '12345',
      name: 'Test User',
      email: email,
      employeeNumber: 'EMP001',
      status: 'active',
      systemRoles: {
        'CMS-DEV': ['admin', 'user']
      }
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

app.listen(3000, () => {
  console.log('Mock SSO Server running on http://localhost:3000');
});
```

실행:
```bash
node mock-sso-server.js
```

docker-compose.yml 설정:
```yaml
SSO_BASE_URL: http://host.docker.internal:3000
```

### 옵션 2: 인증 로직 임시 수정

개발 환경에서만 SSO를 우회하도록 코드 수정 (권장하지 않음):

```typescript
// 개발 환경에서만 사용
if (process.env.NODE_ENV === 'development' && !this.ssoBaseUrl) {
  // Mock 사용자 반환
  return {
    accessToken: this.jwtService.sign({ sub: 'dev-user', email }),
    refreshToken: this.jwtService.sign({ sub: 'dev-user', email }, { expiresIn: '7d' }),
    user: {
      id: 'dev-user',
      externalId: 'dev-user',
      email,
      name: 'Development User',
      employeeNumber: 'DEV001',
      roles: ['admin'],
      status: 'active',
    }
  };
}
```

## 📝 체크리스트

컨테이너 재시작 전 확인사항:

- [ ] `docker-compose.yml`에 `SSO_BASE_URL` 환경 변수 추가됨
- [ ] SSO 서버 URL이 올바르게 설정됨 (네트워크 접근 가능한 URL)
- [ ] SSO 서버가 실행 중임
- [ ] 방화벽/보안 그룹에서 SSO 서버 포트 허용됨
- [ ] Docker 네트워크 설정이 올바름

## 🔍 추가 디버깅

### SSO 연결 테스트

컨테이너 내부에서 SSO 서버에 접근 가능한지 확인:

```bash
# 컨테이너 접속
docker exec -it lumir-cms-app sh

# SSO 서버 연결 테스트
wget -O- http://your-sso-url/api/auth/login
# 또는
curl http://your-sso-url/api/auth/login
```

### 로그 레벨 증가

더 자세한 로그를 보려면 `main.ts` 수정:

```typescript
const app = await NestFactory.create<NestExpressApplication>(AppModule, {
  logger: ['error', 'warn', 'log', 'debug', 'verbose'],  // verbose 추가
});
```

## 🎯 결론

**핵심 문제**: `SSO_BASE_URL` 환경 변수 누락  
**해결책**: docker-compose.yml에 실제 SSO 서버 URL 추가  
**재시작**: `docker-compose down && docker-compose up -d`

SSO 서버 URL을 올바르게 설정하면 로그인이 정상적으로 완료됩니다.
