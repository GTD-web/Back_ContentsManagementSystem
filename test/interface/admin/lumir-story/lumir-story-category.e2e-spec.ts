import { BaseE2ETest } from '../../../base-e2e.spec';

describe('루미르스토리 카테고리 관리 (E2E)', () => {
  const testSuite = new BaseE2ETest();
  let createdCategoryId: string;

  beforeAll(async () => {
    await testSuite.beforeAll();
  });

  afterAll(async () => {
    await testSuite.afterAll();
  });

  beforeEach(async () => {
    await testSuite.cleanupBeforeTest();
  });

  describe('POST /api/admin/lumir-stories/categories - 루미르스토리 카테고리 생성', () => {
    it('카테고리를 생성할 수 있어야 한다', async () => {
      const response = await testSuite
        .request()
        .post('/api/admin/lumir-stories/categories')
        .send({
          name: '회사 소개',
          description: '회사 관련 루미르스토리',
          order: 1,
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('회사 소개');
      expect(response.body.order).toBe(1);
      expect(response.body.isActive).toBe(true);
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');

      createdCategoryId = response.body.id;
    });

    it('이름 없이 카테고리를 생성하면 실패해야 한다', async () => {
      await testSuite
        .request()
        .post('/api/admin/lumir-stories/categories')
        .send({
          description: '설명만 있음',
        })
        .expect(400);
    });
  });

  describe('GET /api/admin/lumir-stories/categories - 루미르스토리 카테고리 목록 조회', () => {
    it('카테고리 목록을 조회할 수 있어야 한다', async () => {
      // Given: 카테고리 생성
      const createResponse = await testSuite
        .request()
        .post('/api/admin/lumir-stories/categories')
        .send({
          name: '테스트 카테고리',
          description: '테스트용',
          order: 1,
        });

      const categoryId = createResponse.body.id;

      // When: 목록 조회
      const response = await testSuite
        .request()
        .get('/api/admin/lumir-stories/categories')
        .expect(200);

      // Then
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.total).toBeGreaterThanOrEqual(1);

      const foundCategory = response.body.items.find(
        (cat: any) => cat.id === categoryId,
      );
      expect(foundCategory).toBeDefined();
      expect(foundCategory.name).toBe('테스트 카테고리');
    });
  });

  describe('PATCH /api/admin/lumir-stories/categories/:id/order - 루미르스토리 카테고리 오더 변경', () => {
    it('카테고리 오더를 변경할 수 있어야 한다', async () => {
      // Given: 카테고리 생성
      const createResponse = await testSuite
        .request()
        .post('/api/admin/lumir-stories/categories')
        .send({
          name: '오더 테스트',
          order: 1,
        });

      const categoryId = createResponse.body.id;

      // When: 오더 변경
      const response = await testSuite
        .request()
        .patch(`/api/admin/lumir-stories/categories/${categoryId}/order`)
        .send({
          order: 10,
        })
        .expect(200);

      // Then
      expect(response.body.id).toBe(categoryId);
      expect(response.body.order).toBe(10);
    });

    it('존재하지 않는 카테고리의 오더를 변경하면 실패해야 한다', async () => {
      await testSuite
        .request()
        .patch(
          '/api/admin/lumir-stories/categories/00000000-0000-0000-0000-000000000001/order',
        )
        .send({
          order: 5,
        })
        .expect(404);
    });
  });

  describe('DELETE /api/admin/lumir-stories/categories/:id - 루미르스토리 카테고리 삭제', () => {
    it('카테고리를 삭제할 수 있어야 한다', async () => {
      // Given: 카테고리 생성
      const createResponse = await testSuite
        .request()
        .post('/api/admin/lumir-stories/categories')
        .send({
          name: '삭제 테스트',
        });

      const categoryId = createResponse.body.id;

      // When: 삭제
      const response = await testSuite
        .request()
        .delete(`/api/admin/lumir-stories/categories/${categoryId}`)
        .expect(200);

      // Then
      expect(response.body.success).toBe(true);
    });

    it('삭제된 카테고리는 목록에 나타나지 않아야 한다', async () => {
      // Given: 카테고리 생성 후 삭제
      const createResponse = await testSuite
        .request()
        .post('/api/admin/lumir-stories/categories')
        .send({
          name: '삭제 테스트 2',
        });

      const categoryId = createResponse.body.id;

      await testSuite
        .request()
        .delete(`/api/admin/lumir-stories/categories/${categoryId}`)
        .expect(200);

      // When: 목록 조회
      const response = await testSuite
        .request()
        .get('/api/admin/lumir-stories/categories')
        .expect(200);

      // Then
      const found = response.body.items.find(
        (cat: any) => cat.id === categoryId,
      );
      expect(found).toBeUndefined();
    });

    it('존재하지 않는 카테고리를 삭제하면 404 에러가 발생해야 한다', async () => {
      await testSuite
        .request()
        .delete(
          '/api/admin/lumir-stories/categories/00000000-0000-0000-0000-000000000001',
        )
        .expect(404);
    });
  });
});
