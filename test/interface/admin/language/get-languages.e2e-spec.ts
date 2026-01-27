import { BaseE2ETest } from '../../../base-e2e.spec';

describe('GET /api/admin/languages (언어 목록 조회)', () => {
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
    it('서버 시작 시 기본 언어가 자동 초기화되어야 한다', async () => {
      // When - 서버 시작 후 언어 목록 조회
      const response = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      // Then - 기본 언어 4개가 이미 초기화되어 있어야 함
      expect(response.body.items).toHaveLength(4);
      expect(response.body.total).toBe(4);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: 'ko', name: '한국어' }),
          expect.objectContaining({ code: 'en', name: 'English' }),
          expect.objectContaining({ code: 'ja', name: '日本語' }),
          expect.objectContaining({ code: 'zh', name: '中文' }),
        ]),
      );
    });

    it('등록된 언어 목록을 조회해야 한다', async () => {
      // Given - 기본 언어 초기화
      await testSuite.initializeDefaultLanguages();

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      // Then
      expect(response.body.items).toHaveLength(4); // en, ko, ja, zh
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: 'ko', name: '한국어' }),
          expect.objectContaining({ code: 'en', name: 'English' }),
          expect.objectContaining({ code: 'ja', name: '日本語' }),
          expect.objectContaining({ code: 'zh', name: '中文' }),
        ]),
      );
    });

    it('isActive 필드가 포함되어야 한다', async () => {
      // Given
      await testSuite.initializeDefaultLanguages();

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      // Then
      expect(response.body.items[0]).toHaveProperty('isActive');
      expect(typeof response.body.items[0].isActive).toBe('boolean');
    });

    it('isDefault 필드가 포함되어야 하고 기본 언어가 표시되어야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      // Then
      // 모든 언어에 isDefault 필드가 있어야 함
      response.body.items.forEach((lang: any) => {
        expect(lang).toHaveProperty('isDefault');
        expect(typeof lang.isDefault).toBe('boolean');
      });

      // 기본 언어(테스트 환경: ko) 확인
      const defaultLanguage = response.body.items.find(
        (lang: any) => lang.isDefault === true,
      );
      expect(defaultLanguage).toBeDefined();
      expect(defaultLanguage.code).toBe('ko'); // 테스트 환경의 기본 언어

      // 나머지 언어는 isDefault가 false여야 함
      const nonDefaultLanguages = response.body.items.filter(
        (lang: any) => lang.isDefault === false,
      );
      expect(nonDefaultLanguages).toHaveLength(3); // en, ja, zh
    });
  });
});
