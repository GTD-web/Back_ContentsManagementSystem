# 기타 Context 데이터 흐름

이 문서는 패턴이 유사한 기타 Context들을 간결하게 다룹니다.

## 📋 목차

1. [Main Popup Context](#1-main-popup-context)
2. [Video Gallery Context](#2-video-gallery-context)
3. [Lumir Story Context](#3-lumir-story-context)
4. [Language Context](#4-language-context)
5. [Company Context](#5-company-context)

---

## 1. Main Popup Context

### 개요

메인 페이지 팝업 관리를 담당합니다.

**주요 기능**:
- 다국어 지원 (ko/en/ja/zh)
- 이미지 업로드
- 노출 기간 설정 (startDate ~ endDate)
- 팝업 크기/위치 설정
- 순서 관리

### 도메인 모델

```typescript
@Entity('main_popups')
export class MainPopup extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  imageUrl: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  linkUrl: string | null;

  @Column({ type: 'date' })
  startDate: Date; // 노출 시작일

  @Column({ type: 'date' })
  endDate: Date; // 노출 종료일

  @Column({ type: 'int', default: 600 })
  width: number; // 팝업 너비 (px)

  @Column({ type: 'int', default: 400 })
  height: number; // 팝업 높이 (px)

  @Column({ type: 'int', default: 100 })
  positionX: number; // X 좌표

  @Column({ type: 'int', default: 100 })
  positionY: number; // Y 좌표

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  @OneToMany(() => MainPopupTranslation, translation => translation.popup, {
    cascade: true,
  })
  translations: MainPopupTranslation[];
}
```

### 주요 비즈니스 로직

**노출 기간 검증**:

```typescript
private validateDisplayPeriod(startDate: Date, endDate: Date): void {
  if (startDate > endDate) {
    throw new BadRequestException('시작일은 종료일보다 이전이어야 합니다');
  }

  // 종료일이 과거인 경우 경고
  const today = new Date();
  if (endDate < today) {
    this.logger.warn(`팝업 종료일이 과거입니다: ${endDate}`);
  }
}
```

**활성 팝업 조회**:

```typescript
async getActivePopups(languageCode: string = 'ko'): Promise<MainPopup[]> {
  const today = new Date();

  return await this.popupRepository
    .createQueryBuilder('popup')
    .leftJoinAndSelect('popup.translations', 'translation')
    .where('popup.isPublic = true')
    .andWhere('popup.startDate <= :today', { today })
    .andWhere('popup.endDate >= :today', { today })
    .orderBy('popup.order', 'DESC')
    .getMany();
}
```

**스케줄러 (만료 팝업 자동 비공개)**:

```typescript
@Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
async deactivateExpiredPopups() {
  const today = new Date();

  const result = await this.popupRepository
    .createQueryBuilder()
    .update(MainPopup)
    .set({ isPublic: false })
    .where('endDate < :today', { today })
    .andWhere('isPublic = true')
    .execute();

  this.logger.log(`만료 팝업 비공개 처리: ${result.affected}개`);
}
```

---

## 2. Video Gallery Context

### 개요

비디오 콘텐츠 관리를 담당합니다.

**주요 기능**:
- YouTube/Vimeo 링크 관리
- 썸네일 이미지
- 카테고리 분류
- 순서 관리
- 다국어 지원 없음 (한국어)

### 도메인 모델

```typescript
@Entity('video_galleries')
export class VideoGallery extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 512 })
  videoUrl: string; // YouTube, Vimeo URL

  @Column({ type: 'varchar', length: 50 })
  videoType: string; // 'youtube' | 'vimeo'

  @Column({ type: 'varchar', length: 100 })
  videoId: string; // YouTube/Vimeo Video ID

  @Column({ type: 'varchar', length: 512, nullable: true })
  thumbnailUrl: string | null;

  @Column({ type: 'int', default: 0 })
  duration: number; // 재생 시간 (초)

  @Column({ type: 'date', nullable: true })
  publishDate: Date | null;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;
}
```

### 주요 비즈니스 로직

**비디오 URL 파싱**:

```typescript
interface VideoInfo {
  type: 'youtube' | 'vimeo';
  videoId: string;
  thumbnailUrl: string;
}

parseVideoUrl(url: string): VideoInfo {
  // YouTube 패턴
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);

  if (youtubeMatch) {
    const videoId = youtubeMatch[1];
    return {
      type: 'youtube',
      videoId,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  }

  // Vimeo 패턴
  const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|)(\d+)(?:$|\/|\?)/;
  const vimeoMatch = url.match(vimeoRegex);

  if (vimeoMatch) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId,
      thumbnailUrl: '', // Vimeo API로 별도 조회 필요
    };
  }

  throw new BadRequestException('지원하지 않는 비디오 URL입니다');
}
```

**비디오 생성**:

```typescript
async 비디오_생성(data: CreateVideoDto): Promise<VideoGallery> {
  // URL 파싱
  const videoInfo = this.parseVideoUrl(data.videoUrl);

  // 비디오 생성
  const video = await this.videoService.생성한다({
    title: data.title,
    description: data.description,
    videoUrl: data.videoUrl,
    videoType: videoInfo.type,
    videoId: videoInfo.videoId,
    thumbnailUrl: videoInfo.thumbnailUrl,
    publishDate: data.publishDate,
    isPublic: data.isPublic ?? false,
    order: await this.calculateNextOrder(),
    createdBy: data.createdBy,
  });

  return video;
}
```

---

## 3. Lumir Story Context

### 개요

회사 스토리 및 콘텐츠 관리를 담당합니다.

**주요 기능**:
- 스토리 생성, 수정, 삭제
- 이미지 업로드 (썸네일, 본문)
- 카테고리 분류
- 순서 관리
- 다국어 지원 없음 (한국어)

### 도메인 모델

```typescript
@Entity('lumir_stories')
export class LumirStory extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ type: 'text' })
  content: string; // HTML 본문

  @Column({ type: 'varchar', length: 512, nullable: true })
  thumbnailUrl: string | null;

  @Column({ type: 'jsonb', nullable: true })
  images: string[] | null; // 본문 이미지 URL 배열

  @Column({ type: 'date', nullable: true })
  publishDate: Date | null;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'int', default: 0 })
  viewCount: number; // 조회수
}
```

### 주요 비즈니스 로직

**조회수 증가**:

```typescript
async incrementViewCount(storyId: string): Promise<void> {
  await this.storyRepository.increment(
    { id: storyId },
    'viewCount',
    1,
  );
}
```

**인기 스토리 조회**:

```typescript
async getPopularStories(limit: number = 5): Promise<LumirStory[]> {
  return await this.storyRepository.find({
    where: { isPublic: true },
    order: { viewCount: 'DESC', publishDate: 'DESC' },
    take: limit,
  });
}
```

**본문 이미지 추출**:

```typescript
extractImagesFromContent(htmlContent: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const images: string[] = [];
  let match;

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    images.push(match[1]);
  }

  return images;
}

async updateStoryWithExtractedImages(storyId: string): Promise<void> {
  const story = await this.storyRepository.findOne({ where: { id: storyId } });
  
  if (story && story.content) {
    const images = this.extractImagesFromContent(story.content);
    story.images = images;
    await this.storyRepository.save(story);
  }
}
```

---

## 4. Language Context

### 개요

시스템 언어 설정 관리를 담당합니다.

**주요 기능**:
- 언어 활성화/비활성화
- 지원 언어: ko, en, ja, zh

### 도메인 모델

```typescript
@Entity('languages')
export class Language extends BaseEntity {
  @Column({ type: 'varchar', length: 10, unique: true })
  code: string; // 'ko', 'en', 'ja', 'zh'

  @Column({ type: 'varchar', length: 50 })
  name: string; // '한국어', 'English', '日本語', '中文'

  @Column({ type: 'varchar', length: 50, nullable: true })
  nativeName: string | null; // 원어 표기

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;
}
```

### 주요 비즈니스 로직

**활성 언어 조회**:

```typescript
async getActiveLanguages(): Promise<Language[]> {
  return await this.languageRepository.find({
    where: { isActive: true },
    order: { order: 'ASC' },
  });
}
```

**언어 코드로 조회**:

```typescript
async 코드로_언어를_조회한다(code: string): Promise<Language> {
  const language = await this.languageRepository.findOne({
    where: { code, isActive: true },
  });

  if (!language) {
    throw new NotFoundException(`언어를 찾을 수 없습니다: ${code}`);
  }

  return language;
}
```

**기본 언어 설정**:

```typescript
const DEFAULT_LANGUAGES = [
  { code: 'ko', name: '한국어', nativeName: '한국어', isActive: true, order: 1 },
  { code: 'en', name: 'English', nativeName: 'English', isActive: true, order: 2 },
  { code: 'ja', name: '일본어', nativeName: '日本語', isActive: true, order: 3 },
  { code: 'zh', name: '중국어', nativeName: '中文', isActive: true, order: 4 },
];

async initializeLanguages(): Promise<void> {
  for (const lang of DEFAULT_LANGUAGES) {
    const existing = await this.languageRepository.findOne({
      where: { code: lang.code },
    });

    if (!existing) {
      await this.languageRepository.save(lang);
    }
  }
}
```

---

## 5. Company Context

### 개요

조직 정보 조회를 담당합니다 (SSO 시스템 연동).

**주요 기능**:
- 조직도 조회
- 부서 목록 조회
- 직급 목록 조회
- 직책 목록 조회
- 사용자 정보 조회

### 인터페이스

```typescript
interface OrganizationInfo {
  departments: Department[];
  ranks: Rank[];
  positions: Position[];
}

interface Department {
  code: string;
  name: string;
  parentCode: string | null;
  employeeIds: string[];
}

interface Rank {
  code: string;
  name: string;
  level: number;
  employeeIds: string[];
}

interface Position {
  code: string;
  name: string;
  employeeIds: string[];
}
```

### 주요 비즈니스 로직

**조직 정보 조회 (SSO API)**:

```typescript
async 조직_정보를_조회한다(): Promise<OrganizationInfo> {
  const ssoUrl = this.configService.get('SSO_BASE_URL');

  // SSO API 호출
  const response = await axios.get(`${ssoUrl}/organization`);

  return {
    departments: response.data.departments,
    ranks: response.data.ranks,
    positions: response.data.positions,
  };
}
```

**부서 목록 조회**:

```typescript
async 부서_목록을_조회한다(): Promise<Department[]> {
  const orgInfo = await this.조직_정보를_조회한다();
  return orgInfo.departments;
}
```

**사용자 정보 조회**:

```typescript
interface UserInfo {
  userId: string;
  name: string;
  email: string;
  departmentCode: string;
  departmentName: string;
  rankCode: string;
  rankName: string;
  positionCode: string | null;
  positionName: string | null;
}

async getUserInfo(userId: string): Promise<UserInfo> {
  const ssoUrl = this.configService.get('SSO_BASE_URL');

  const response = await axios.get(`${ssoUrl}/users/${userId}`);

  return response.data;
}
```

**캐싱 전략**:

```typescript
@Injectable()
export class CompanyContextService {
  private readonly CACHE_TTL = 300; // 5분

  async 부서_목록을_조회한다(): Promise<Department[]> {
    const cacheKey = 'company:departments';

    // 캐시 조회
    const cached = await this.cacheManager.get<Department[]>(cacheKey);
    if (cached) {
      return cached;
    }

    // SSO API 호출
    const departments = await this.fetchDepartmentsFromSSO();

    // 캐시 저장
    await this.cacheManager.set(cacheKey, departments, { ttl: this.CACHE_TTL });

    return departments;
  }
}
```

---

## 6. 공통 패턴 요약

### 파일 업로드

**Main Popup, Video Gallery, Lumir Story**:
- 이미지 업로드
- 썸네일 생성
- S3 저장

### 카테고리 필터링

**Video Gallery, Lumir Story, News, IR**:
- CategoryMapping 테이블 사용
- N:M 관계
- 카테고리별 조회

### 날짜 기반 필터

**Main Popup**:
- 노출 기간 (startDate ~ endDate)
- 활성 팝업 자동 필터링

**Video Gallery, Lumir Story, News, IR**:
- publishDate 기준 정렬
- 최신순 조회

### 조회수/통계

**Lumir Story**:
- viewCount 증가
- 인기 콘텐츠 조회

### 외부 시스템 연동

**Company Context**:
- SSO API 연동
- 조직 정보 캐싱
- 5분 TTL

---

## 7. 성능 최적화

### 인덱스 전략

```sql
-- Main Popup
CREATE INDEX idx_main_popup_dates ON main_popups(start_date, end_date);
CREATE INDEX idx_main_popup_public ON main_popups(is_public);

-- Video Gallery
CREATE INDEX idx_video_gallery_publish ON video_galleries(publish_date DESC);
CREATE INDEX idx_video_gallery_type ON video_galleries(video_type);

-- Lumir Story
CREATE INDEX idx_lumir_story_publish ON lumir_stories(publish_date DESC);
CREATE INDEX idx_lumir_story_views ON lumir_stories(view_count DESC);

-- Language
CREATE INDEX idx_language_code ON languages(code) WHERE is_active = true;
```

### 캐싱 전략

| Context | 캐시 대상 | TTL |
|---------|----------|-----|
| Main Popup | 활성 팝업 목록 | 10분 |
| Video Gallery | 공개 비디오 목록 | 10분 |
| Lumir Story | 인기 스토리 | 30분 |
| Language | 활성 언어 목록 | 1시간 |
| Company | 조직 정보 | 5분 |

---

**문서 생성일**: 2026년 1월 14일  
**버전**: v1.0
