import { BaseE2ETest } from '../../../base-e2e.spec';

describe('POST /api/admin/languages (언어 추가)', () => {
  const testSuite = new BaseE2ETest();

  beforeAll(async () => {
    await testSuite.beforeAll();
  });

  afterAll(async () => {
    await testSuite.afterAll();
  });

  beforeEach(async () => {
    await testSuite.cleanupBeforeTest();
    await testSuite.initializeDefaultLanguages();
  });

  describe('성공 케이스', () => {
    it('유효한 데이터로 언어를 추가해야 한다', async () => {
      // Given
      const createDto = {
        code: 'fr',
        name: 'Français',
        isActive: true,
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/languages')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body).toMatchObject({
        id: expect.any(String),
        code: 'fr',
        name: 'Français',
        isActive: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('여러 언어를 추가해야 한다', async () => {
      // Given
      const languages = [
        { code: 'fr', name: 'Français', isActive: true },
        { code: 'de', name: 'Deutsch', isActive: true },
        { code: 'es', name: 'Español', isActive: false },
      ];

      // When & Then
      for (const lang of languages) {
        const response = await testSuite
          .request()
          .post('/api/admin/languages')
          .send(lang)
          .expect(201);

        expect(response.body).toMatchObject({
          code: lang.code,
          name: lang.name,
          isActive: lang.isActive,
        });
      }
    });

    it('기본값으로 isActive가 true여야 한다', async () => {
      // Given
      const createDto = {
        code: 'fr',
        name: 'Français',
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/languages')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body.isActive).toBe(true);
    });

    it('추가된 언어는 언어 목록에 나타나야 한다', async () => {
      // Given
      const createDto = {
        code: 'fr',
        name: 'Français',
        isActive: true,
      };

      // When
      await testSuite
        .request()
        .post('/api/admin/languages')
        .send(createDto)
        .expect(201);

      // Then
      const listResponse = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      const frInList = listResponse.body.items.find(
        (lang: any) => lang.code === 'fr',
      );
      expect(frInList).toBeDefined();
      expect(frInList.name).toBe('Français');
    });

    it('새로 추가된 언어는 기본 언어가 아니어야 한다', async () => {
      // Given
      const createDto = {
        code: 'fr',
        name: 'Français',
        isActive: true,
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/languages')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body.isDefault).toBe(false);
    });
  });

  describe('실패 케이스 - 필수 필드 누락', () => {
    it('code가 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        name: 'Français',
        isActive: true,
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/languages')
        .send(createDto)
        .expect(400);
    });

    it('name이 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        code: 'fr',
        isActive: true,
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/languages')
        .send(createDto)
        .expect(400);
    });
  });

  describe('실패 케이스 - 잘못된 데이터 타입', () => {
    it('code가 문자열이 아닌 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        code: 123,
        name: 'Français',
        isActive: true,
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/languages')
        .send(createDto)
        .expect(400);
    });

    it('isActive가 boolean이 아닌 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        code: 'fr',
        name: 'Français',
        isActive: 'true',
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/languages')
        .send(createDto)
        .expect(400);
    });

    it('유효하지 않은 ISO 639-1 코드인 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        code: 'invalid',
        name: 'Invalid Language',
        isActive: true,
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/languages')
        .send(createDto)
        .expect(400);
    });
  });

  describe('실패 케이스 - 중복 데이터', () => {
    it('이미 존재하는 code로 추가 시 409 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        code: 'fr',
        name: 'Français',
        isActive: true,
      };

      await testSuite.request().post('/api/admin/languages').send(createDto);

      // When & Then - 같은 코드로 다시 추가 시도
      await testSuite
        .request()
        .post('/api/admin/languages')
        .send(createDto)
        .expect(409);
    });

    it('기본 언어 코드로 추가 시도하면 409 에러가 발생해야 한다', async () => {
      // Given - 이미 초기화된 한국어 추가 시도
      const createDto = {
        code: 'ko',
        name: '한국어 (새로 추가)',
        isActive: true,
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/languages')
        .send(createDto)
        .expect(409);
    });
  });
});
