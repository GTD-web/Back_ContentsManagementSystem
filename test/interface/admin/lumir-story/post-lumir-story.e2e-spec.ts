import { BaseE2ETest } from '../../../base-e2e.spec';

describe('POST /api/admin/lumir-stories (루미르스토리 생성)', () => {
  const testSuite = new BaseE2ETest();

  beforeAll(async () => {
    await testSuite.beforeAll();
  });

  afterAll(async () => {
    await testSuite.afterAll();
  });

  beforeEach(async () => {
    await testSuite.cleanupBeforeTest();
  });

  describe('성공 케이스', () => {
    it('유효한 데이터로 루미르스토리를 생성해야 한다', async () => {
      // Given
      const createDto = {
        title: '루미르 스토리 제목',
        content: '루미르 스토리 내용',
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/lumir-stories')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body).toMatchObject({
        id: expect.any(String),
        title: '루미르 스토리 제목',
        content: '루미르 스토리 내용',
        isPublic: true, // 기본값 확인
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('이미지 URL을 포함한 루미르스토리를 생성해야 한다', async () => {
      // Given
      const createDto = {
        title: '루미르 스토리 제목',
        content: '루미르 스토리 내용',
        imageUrl: 'https://s3.aws.com/image.jpg',
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/lumir-stories')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body.imageUrl).toBe('https://s3.aws.com/image.jpg');
    });
  });

  describe('실패 케이스 - 필수 필드 누락', () => {
    it('title이 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        content: '내용만 있음',
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/lumir-stories')
        .send(createDto)
        .expect(400);
    });

    it('content가 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        title: '제목만 있음',
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/lumir-stories')
        .send(createDto)
        .expect(400);
    });
  });
});
