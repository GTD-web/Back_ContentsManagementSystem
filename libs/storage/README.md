# Storage Service 추상화

이 폴더는 파일 저장소를 추상화하여 다양한 환경에서 쉽게 전환할 수 있도록 합니다.

## 아키텍처

### Strategy Pattern 적용
```
IStorageService (Interface)
    ├── LocalStorageService (로컬 파일 시스템)
    └── S3Service (AWS S3)
```

### 환경별 전환
환경 변수 `NODE_ENV`에 따라 자동으로 적절한 서비스가 주입됩니다:
- `development`, `dev`: LocalStorageService (로컬 파일 시스템, `dev/` prefix)
- `test`: LocalStorageService (로컬 파일 시스템, `test/` prefix)
- `staging`, `stage`: S3Service (AWS S3, `stage/` prefix)
- `production`, `prod`: S3Service (AWS S3, `prod/` prefix)

#### 테스트 환경에서 실제 S3 사용
테스트에서는 기본적으로 로컬 스토리지를 사용하지만, 실제 S3를 테스트해야 하는 경우:
```env
USE_REAL_S3_IN_TEST=true
```
환경 변수를 설정하면 테스트에서도 S3를 사용하며, **`test/` prefix**를 사용하여 실제 데이터와 분리합니다.

## 사용 방법

### 1. Business Service에서 주입받기

```typescript
import { Inject } from '@nestjs/common';
import { STORAGE_SERVICE } from '@libs/storage/storage.module';
import { IStorageService } from '@libs/storage/interfaces/storage.interface';

@Injectable()
export class YourBusinessService {
  constructor(
    @Inject(STORAGE_SERVICE)
    private readonly storageService: IStorageService,
  ) {}

  async uploadFiles(files: Express.Multer.File[]) {
    const uploadedFiles = await this.storageService.uploadFiles(
      files,
      'your-folder',
    );
    return uploadedFiles;
  }
}
```

### 2. 환경 설정

#### 로컬 개발 환경 (.env)
```env
NODE_ENV=development
LOCAL_UPLOAD_DIR=uploads
LOCAL_STORAGE_BASE_URL=http://localhost:4001/uploads
```

#### 스테이징/프로덕션 환경 (.env)
```env
NODE_ENV=production
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

#### 테스트 환경에서 실제 S3 테스트 (.env)
```env
NODE_ENV=test
USE_REAL_S3_IN_TEST=true
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=your-test-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## LocalStorageService

### 특징
- 로컬 파일 시스템에 파일 저장
- `uploads` 폴더에 파일 저장
- NestJS 정적 파일 서빙으로 접근 가능

### 파일 경로 구조
```
project-root/
  └── uploads/
      ├── dev/                  # 개발 환경 prefix
      │   ├── brochures/
      │   │   ├── uuid-1.pdf
      │   │   └── uuid-2.jpg
      │   └── electronic-disclosures/
      │       └── uuid-3.pdf
      └── test/                 # 테스트 환경 prefix
          ├── brochures/
          │   └── uuid-4.pdf
          └── electronic-disclosures/
              └── uuid-5.pdf
```

### URL 형식
```
http://localhost:4001/uploads/dev/brochures/uuid-1.pdf   # 개발
http://localhost:4001/uploads/test/brochures/uuid-4.pdf  # 테스트
```

## S3Service

### 특징
- AWS S3에 파일 업로드
- CloudFront CDN 연동 가능
- 환경별 폴더 분리 (stage/, prod/)

### 공개 액세스 설정
2023년 4월부터 AWS S3는 새 버킷에서 ACL을 기본적으로 비활성화합니다.
파일을 공개적으로 접근 가능하게 하려면 **버킷 정책(Bucket Policy)** 을 설정하세요:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

또는 CloudFront를 통해 배포하는 것을 권장합니다.

### 파일 경로 구조
```
s3://your-bucket/
  ├── test/                     # 테스트 환경 (USE_REAL_S3_IN_TEST=true)
  │   ├── brochures/
  │   │   └── uuid-1.pdf
  │   └── electronic-disclosures/
  │       └── uuid-2.pdf
  ├── stage/                    # 스테이징 환경
  │   ├── brochures/
  │   │   ├── uuid-3.pdf
  │   │   └── uuid-4.jpg
  │   └── electronic-disclosures/
  │       └── uuid-5.pdf
  └── prod/                     # 프로덕션 환경
      ├── brochures/
      │   ├── uuid-6.pdf
      │   └── uuid-7.jpg
      └── electronic-disclosures/
          └── uuid-8.pdf
```

### URL 형식
```
https://your-bucket.s3.ap-northeast-2.amazonaws.com/test/brochures/uuid-1.pdf   # 테스트
https://your-bucket.s3.ap-northeast-2.amazonaws.com/stage/brochures/uuid-3.pdf  # 스테이징
https://your-bucket.s3.ap-northeast-2.amazonaws.com/prod/brochures/uuid-6.pdf   # 프로덕션
```

## 주요 메서드

### uploadFile
단일 파일 업로드
```typescript
const uploaded = await storageService.uploadFile(file, 'folder-name');
// { fileName, fileSize, mimeType, url, order }
```

### uploadFiles
여러 파일 일괄 업로드
```typescript
const uploaded = await storageService.uploadFiles(files, 'folder-name');
// [{ fileName, fileSize, mimeType, url, order }, ...]
```

### deleteFile
단일 파일 삭제
```typescript
await storageService.deleteFile(fileUrl);
```

### deleteFiles
여러 파일 일괄 삭제
```typescript
await storageService.deleteFiles([url1, url2, url3]);
```

## 환경 전환

### 로컬 → 프로덕션
1. `.env` 파일에서 `NODE_ENV=production`으로 변경
2. AWS 자격 증명 설정
3. 애플리케이션 재시작

### 코드 변경 없음!
비즈니스 로직은 `IStorageService` 인터페이스에만 의존하므로,
환경 변수만 변경하면 자동으로 전환됩니다.

### 테스트에서 실제 S3 사용
테스트 코드는 기본적으로 로컬 스토리지를 mock으로 사용합니다.
실제 S3 업로드/다운로드를 테스트해야 하는 경우:

```env
# .env.test
USE_REAL_S3_IN_TEST=true
AWS_REGION=ap-northeast-2
AWS_S3_BUCKET=your-test-bucket
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

이렇게 설정하면 E2E 테스트에서 실제 S3에 파일을 업로드하고 삭제합니다.

## 장점

1. **환경 독립성**: 로컬/프로덕션 환경을 쉽게 전환
2. **테스트 용이**: 로컬에서 AWS 없이 개발 가능
3. **확장성**: 새로운 저장소 추가 시 인터페이스만 구현
4. **유지보수**: 비즈니스 로직과 저장소 로직 분리
