import { BaseE2ETest } from '../../../base-e2e.spec';

describe('POST /api/admin/video-galleries (비디오갤러리 생성)', () => {
  const testSuite = new BaseE2ETest();
  let categoryId: string;

  beforeAll(async () => {
    await testSuite.beforeAll();
  });

  afterAll(async () => {
    await testSuite.afterAll();
  });

  beforeEach(async () => {
    await testSuite.cleanupBeforeTest();
    
    // 테스트용 카테고리 생성
    const categoryResponse = await testSuite
      .request()
      .post('/api/admin/video-galleries/categories')
      .send({
        name: '테스트 카테고리',
        description: '테스트용 카테고리',
      })
      .expect(201);
    
    categoryId = categoryResponse.body.id;
  });

  describe('성공 케이스', () => {
    it('유효한 데이터로 비디오갤러리를 생성해야 한다', async () => {
      // Given
      const createDto = {
        title: '회사 소개 영상',
        categoryId,
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/video-galleries')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body).toMatchObject({
        id: expect.any(String),
        title: '회사 소개 영상',
        categoryId,
        isPublic: true, // 기본값 확인
        order: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
      expect(response.body.categoryName).toBeDefined();
      expect(response.body.categoryName).toBe('테스트 카테고리');
      expect(response.body.category).toBeUndefined();
    });

    it('설명을 포함한 비디오갤러리를 생성해야 한다', async () => {
      // Given
      const createDto = {
        title: '회사 소개 영상',
        categoryId,
        description: '루미르 회사 소개 동영상입니다.',
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/video-galleries')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body.description).toBe('루미르 회사 소개 동영상입니다.');
    });

    it('YouTube URL을 포함한 비디오갤러리를 생성해야 한다', async () => {
      // Given
      const createDto = {
        title: '회사 소개 영상',
        categoryId,
        youtubeUrls: JSON.stringify([
          'https://www.youtube.com/watch?v=abc123',
        ]),
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/video-galleries')
        .field('title', createDto.title)
        .field('categoryId', createDto.categoryId)
        .field('youtubeUrls', createDto.youtubeUrls)
        .expect(201);

      // Then
      expect(response.body.videoSources).toBeDefined();
      expect(response.body.videoSources.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('실패 케이스 - 필수 필드 누락', () => {
    it('title이 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        categoryId,
        description: '설명만 있음',
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/video-galleries')
        .send(createDto)
        .expect(400);
    });

    it('categoryId가 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        title: '회사 소개 영상',
        description: '카테고리 없음',
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/video-galleries')
        .send(createDto)
        .expect(400);
    });
  });

  describe('실패 케이스 - 잘못된 YouTube URL 형식', () => {
    it('youtubeUrls가 잘못된 JSON 형식인 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        title: '회사 소개 영상',
        youtubeUrls: 'invalid-json',
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/video-galleries')
        .field('title', createDto.title)
        .field('youtubeUrls', createDto.youtubeUrls)
        .expect(400);
    });
  });
});
