import { BaseE2ETest } from '../../../base-e2e.spec';

describe('PATCH /api/admin/languages/:id (언어 수정)', () => {
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
    it('언어 정보를 수정해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/languages')
        .send({ code: 'ko', name: '한국어', isActive: true });

      const languageId = createResponse.body.id;

      const updateDto = {
        name: '한국어(개정)',
        isActive: false,
      };

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/languages/${languageId}`)
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: languageId,
        code: 'ko',
        name: '한국어(개정)',
        isActive: false,
      });
    });

    it('단일 필드만 수정해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/languages')
        .send({ code: 'ko', name: '한국어', isActive: true });

      const languageId = createResponse.body.id;

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/languages/${languageId}`)
        .send({ isActive: false })
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: languageId,
        code: 'ko',
        name: '한국어',
        isActive: false,
      });
    });
  });

  describe('실패 케이스', () => {
    it('존재하지 않는 ID로 수정 시 404 에러가 발생해야 한다', async () => {
      // Given
      const nonExistentId = '00000000-0000-0000-0000-000000000001';

      // When & Then
      await testSuite
        .request()
        .patch(`/api/admin/languages/${nonExistentId}`)
        .send({ name: '수정된 이름' })
        .expect(404);
    });

    it('잘못된 데이터 타입으로 수정 시 400 에러가 발생해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/languages')
        .send({ code: 'ko', name: '한국어', isActive: true });

      const languageId = createResponse.body.id;

      // When & Then
      await testSuite
        .request()
        .patch(`/api/admin/languages/${languageId}`)
        .send({ isActive: 'invalid' })
        .expect(400);
    });
  });
});

describe('DELETE /api/admin/languages/:id (언어 삭제)', () => {
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
    it('언어를 삭제해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/languages')
        .send({ code: 'ko', name: '한국어', isActive: true });

      const languageId = createResponse.body.id;

      // When
      await testSuite
        .request()
        .delete(`/api/admin/languages/${languageId}`)
        .expect(200);

      // Then: 삭제 후 조회 시 404 에러
      await testSuite
        .request()
        .get(`/api/admin/languages/${languageId}`)
        .expect(404);
    });

    it('삭제 후 목록에서 제외되어야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/languages')
        .send({ code: 'ko', name: '한국어', isActive: true });

      const languageId = createResponse.body.id;

      // When
      await testSuite
        .request()
        .delete(`/api/admin/languages/${languageId}`)
        .expect(200);

      // Then
      const listResponse = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      expect(listResponse.body.items).toHaveLength(0);
    });
  });

  describe('실패 케이스', () => {
    it('존재하지 않는 ID로 삭제 시 404 에러가 발생해야 한다', async () => {
      // Given
      const nonExistentId = '00000000-0000-0000-0000-000000000001';

      // When & Then
      await testSuite
        .request()
        .delete(`/api/admin/languages/${nonExistentId}`)
        .expect(404);
    });
  });
});
