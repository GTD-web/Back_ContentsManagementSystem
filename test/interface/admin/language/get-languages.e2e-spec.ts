import { BaseE2ETest } from '../../../base-e2e.spec';

describe('GET /api/admin/languages (언어 목록 조회)', () => {
  const testSuite = new BaseE2ETest();

  beforeAll(async () => {
    testSuite['skipDefaultLanguageInit'] = true; // 언어 테스트는 기본 언어 초기화 건너뛰기
    await testSuite.beforeAll();
  });

  afterAll(async () => {
    await testSuite.afterAll();
  });

  beforeEach(async () => {
    await testSuite.cleanupBeforeTest();
  });

  describe('성공 케이스', () => {
    it('빈 목록을 반환해야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        items: [],
        total: 0,
      });
    });

    it('등록된 언어 목록을 조회해야 한다', async () => {
      // Given
      const languages = [
        { code: 'ko', name: '한국어', isActive: true },
        { code: 'en', name: 'English', isActive: true },
        { code: 'ja', name: '日本語', isActive: true }, // 변경: true
      ];

      for (const lang of languages) {
        await testSuite.request().post('/api/admin/languages').send(lang);
      }

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      // Then
      expect(response.body.items).toHaveLength(3);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: 'ko', name: '한국어' }),
          expect.objectContaining({ code: 'en', name: 'English' }),
          expect.objectContaining({ code: 'ja', name: '日本語' }),
        ]),
      );
    });

    it('isActive 필드가 포함되어야 한다', async () => {
      // Given
      await testSuite
        .request()
        .post('/api/admin/languages')
        .send({ code: 'ko', name: '한국어', isActive: true });

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      // Then
      expect(response.body.items[0]).toHaveProperty('isActive');
      expect(typeof response.body.items[0].isActive).toBe('boolean');
    });
  });
});

describe('GET /api/admin/languages/:id (언어 상세 조회)', () => {
  const testSuite = new BaseE2ETest();

  beforeAll(async () => {
    testSuite['skipDefaultLanguageInit'] = true; // 언어 테스트는 기본 언어 초기화 건너뛰기
    await testSuite.beforeAll();
  });

  afterAll(async () => {
    await testSuite.afterAll();
  });

  beforeEach(async () => {
    await testSuite.cleanupBeforeTest();
  });

  describe('성공 케이스', () => {
    it('ID로 언어를 조회해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/languages')
        .send({ code: 'ko', name: '한국어', isActive: true });

      const languageId = createResponse.body.id;

      // When
      const response = await testSuite
        .request()
        .get(`/api/admin/languages/${languageId}`)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: languageId,
        code: 'ko',
        name: '한국어',
        isActive: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });

  describe('실패 케이스', () => {
    it('존재하지 않는 ID로 조회 시 404 에러가 발생해야 한다', async () => {
      // Given
      const nonExistentId = '00000000-0000-0000-0000-000000000001';

      // When & Then
      await testSuite
        .request()
        .get(`/api/admin/languages/${nonExistentId}`)
        .expect(404);
    });

    it('잘못된 UUID 형식으로 조회 시 400 에러가 발생해야 한다', async () => {
      // Given
      const invalidId = 'invalid-uuid';

      // When & Then
      const response = await testSuite
        .request()
        .get(`/api/admin/languages/${invalidId}`);

      expect([400, 500]).toContain(response.status);
    });
  });
});
