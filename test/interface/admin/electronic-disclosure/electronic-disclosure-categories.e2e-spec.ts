import { BaseE2ETest } from '../../../base-e2e.spec';

describe('전자공시 카테고리 관리 API', () => {
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

  describe('POST /api/admin/electronic-disclosures/categories (카테고리 생성)', () => {
    it('전자공시 카테고리를 생성해야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '재무제표',
          description: '재무제표 관련 전자공시',
          isActive: true,
          order: 0,
        })
        .expect(201);

      // Then
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('재무제표');
      expect(response.body.description).toBe('재무제표 관련 전자공시');
      expect(response.body.isActive).toBe(true);
      expect(response.body.order).toBe(0);
      expect(response.body.entityType).toBe('electronic_disclosure');
    });

    it('최소 정보만으로 카테고리를 생성해야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '사업보고서',
        })
        .expect(201);

      // Then
      expect(response.body.name).toBe('사업보고서');
      expect(response.body.isActive).toBe(true); // 기본값
      expect(response.body.order).toBe(0); // 기본값
    });

    it('name이 없으면 400 에러를 반환해야 한다', async () => {
      // When & Then
      await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          description: '설명만 있음',
        })
        .expect(400);
    });
  });

  describe('GET /api/admin/electronic-disclosures/categories (카테고리 목록 조회)', () => {
    it('빈 카테고리 목록을 반환해야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .get('/api/admin/electronic-disclosures/categories')
        .expect(200);

      // Then
      expect(response.body.items).toEqual([]);
      expect(response.body.total).toBe(0);
    });

    it('카테고리 목록을 조회해야 한다', async () => {
      // Given - 3개 생성
      await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '재무제표',
          order: 0,
        })
        .expect(201);

      await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '사업보고서',
          order: 1,
        })
        .expect(201);

      await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '공시자료',
          order: 2,
        })
        .expect(201);

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/electronic-disclosures/categories')
        .expect(200);

      // Then
      expect(response.body.items).toHaveLength(3);
      expect(response.body.total).toBe(3);
      expect(response.body.items[0].name).toBe('재무제표');
      expect(response.body.items[1].name).toBe('사업보고서');
      expect(response.body.items[2].name).toBe('공시자료');
    });

    it('비활성 카테고리도 포함하여 조회해야 한다', async () => {
      // Given - 활성/비활성 카테고리 생성
      await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '활성 카테고리',
          isActive: true,
        })
        .expect(201);

      const inactiveCategory = await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '비활성 카테고리',
          isActive: false,
        })
        .expect(201);

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/electronic-disclosures/categories')
        .expect(200);

      // Then
      expect(response.body.items).toHaveLength(2);
      
      const inactive = response.body.items.find(
        (c: any) => c.id === inactiveCategory.body.id,
      );
      expect(inactive.isActive).toBe(false);
    });
  });

  describe('PATCH /api/admin/electronic-disclosures/categories/:id (카테고리 수정)', () => {
    it('카테고리 정보를 수정해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '원본 이름',
          description: '원본 설명',
          isActive: true,
        })
        .expect(201);

      const categoryId = createResponse.body.id;

      // When
      const updateResponse = await testSuite
        .request()
        .patch(`/api/admin/electronic-disclosures/categories/${categoryId}`)
        .send({
          name: '수정된 이름',
          description: '수정된 설명',
          isActive: false,
        })
        .expect(200);

      // Then
      expect(updateResponse.body.name).toBe('수정된 이름');
      expect(updateResponse.body.description).toBe('수정된 설명');
      expect(updateResponse.body.isActive).toBe(false);

      // 다시 조회해서 확인
      const listResponse = await testSuite
        .request()
        .get('/api/admin/electronic-disclosures/categories')
        .expect(200);

      const category = listResponse.body.items.find(
        (c: any) => c.id === categoryId,
      );
      expect(category.name).toBe('수정된 이름');
    });

    it('일부 필드만 수정해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '원본 이름',
          description: '원본 설명',
          isActive: true,
        })
        .expect(201);

      const categoryId = createResponse.body.id;

      // When - name만 수정
      const updateResponse = await testSuite
        .request()
        .patch(`/api/admin/electronic-disclosures/categories/${categoryId}`)
        .send({
          name: '이름만 수정',
        })
        .expect(200);

      // Then
      expect(updateResponse.body.name).toBe('이름만 수정');
      expect(updateResponse.body.description).toBe('원본 설명'); // 변경 없음
      expect(updateResponse.body.isActive).toBe(true); // 변경 없음
    });

    it('존재하지 않는 카테고리를 수정하면 404 에러를 반환해야 한다', async () => {
      // When & Then
      await testSuite
        .request()
        .patch('/api/admin/electronic-disclosures/categories/00000000-0000-0000-0000-000000000001')
        .send({
          name: '수정',
        })
        .expect(404);
    });
  });

  describe('PATCH /api/admin/electronic-disclosures/categories/:id/order (카테고리 순서 변경)', () => {
    it('카테고리 순서를 변경해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '순서 변경 테스트',
          order: 0,
        })
        .expect(201);

      const categoryId = createResponse.body.id;

      // When
      const updateResponse = await testSuite
        .request()
        .patch(`/api/admin/electronic-disclosures/categories/${categoryId}/order`)
        .send({
          order: 5,
        })
        .expect(200);

      // Then
      expect(updateResponse.body.order).toBe(5);

      // 다시 조회해서 확인
      const listResponse = await testSuite
        .request()
        .get('/api/admin/electronic-disclosures/categories')
        .expect(200);

      const category = listResponse.body.items.find(
        (c: any) => c.id === categoryId,
      );
      expect(category.order).toBe(5);
    });

    it('여러 카테고리의 순서를 변경해야 한다', async () => {
      // Given - 3개 생성
      const category1 = await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '카테고리 1',
          order: 0,
        })
        .expect(201);

      const category2 = await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '카테고리 2',
          order: 1,
        })
        .expect(201);

      const category3 = await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '카테고리 3',
          order: 2,
        })
        .expect(201);

      // When - 순서 변경 (3 -> 1 -> 2)
      await testSuite
        .request()
        .patch(`/api/admin/electronic-disclosures/categories/${category3.body.id}/order`)
        .send({ order: 0 })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/electronic-disclosures/categories/${category1.body.id}/order`)
        .send({ order: 1 })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/electronic-disclosures/categories/${category2.body.id}/order`)
        .send({ order: 2 })
        .expect(200);

      // Then
      const listResponse = await testSuite
        .request()
        .get('/api/admin/electronic-disclosures/categories')
        .expect(200);

      expect(listResponse.body.items[0].id).toBe(category3.body.id);
      expect(listResponse.body.items[1].id).toBe(category1.body.id);
      expect(listResponse.body.items[2].id).toBe(category2.body.id);
    });
  });

  describe('DELETE /api/admin/electronic-disclosures/categories/:id (카테고리 삭제)', () => {
    it('카테고리를 삭제해야 한다 (Soft Delete)', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '삭제 테스트',
        })
        .expect(201);

      const categoryId = createResponse.body.id;

      // When
      const deleteResponse = await testSuite
        .request()
        .delete(`/api/admin/electronic-disclosures/categories/${categoryId}`)
        .expect(200);

      // Then
      expect(deleteResponse.body.success).toBe(true);

      // 목록에서 조회되지 않음
      const listResponse = await testSuite
        .request()
        .get('/api/admin/electronic-disclosures/categories')
        .expect(200);

      const deletedCategory = listResponse.body.items.find(
        (c: any) => c.id === categoryId,
      );
      expect(deletedCategory).toBeUndefined();
    });

    it('존재하지 않는 카테고리를 삭제하면 404 에러를 반환해야 한다', async () => {
      // When & Then
      await testSuite
        .request()
        .delete('/api/admin/electronic-disclosures/categories/00000000-0000-0000-0000-000000000001')
        .expect(404);
    });
  });

  describe('카테고리 통합 시나리오', () => {
    it('카테고리를 생성, 수정, 삭제하는 전체 흐름이 정상 동작해야 한다', async () => {
      // 1. 카테고리 생성
      const createResponse = await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '통합 테스트 카테고리',
          description: '통합 테스트용 카테고리',
          isActive: true,
          order: 0,
        })
        .expect(201);

      const categoryId = createResponse.body.id;
      expect(createResponse.body.name).toBe('통합 테스트 카테고리');

      // 2. 목록 조회
      const listResponse1 = await testSuite
        .request()
        .get('/api/admin/electronic-disclosures/categories')
        .expect(200);

      expect(listResponse1.body.items).toHaveLength(1);

      // 3. 카테고리 수정
      const updateResponse = await testSuite
        .request()
        .patch(`/api/admin/electronic-disclosures/categories/${categoryId}`)
        .send({
          name: '수정된 카테고리',
          isActive: false,
        })
        .expect(200);

      expect(updateResponse.body.name).toBe('수정된 카테고리');
      expect(updateResponse.body.isActive).toBe(false);

      // 4. 순서 변경
      const orderResponse = await testSuite
        .request()
        .patch(`/api/admin/electronic-disclosures/categories/${categoryId}/order`)
        .send({
          order: 10,
        })
        .expect(200);

      expect(orderResponse.body.order).toBe(10);

      // 5. 카테고리 삭제
      await testSuite
        .request()
        .delete(`/api/admin/electronic-disclosures/categories/${categoryId}`)
        .expect(200);

      // 6. 삭제 확인
      const listResponse2 = await testSuite
        .request()
        .get('/api/admin/electronic-disclosures/categories')
        .expect(200);

      expect(listResponse2.body.items).toHaveLength(0);
    });

    it('여러 카테고리를 생성하고 순서대로 조회해야 한다', async () => {
      // Given - 순서 역순으로 생성
      await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '카테고리 C',
          order: 2,
        })
        .expect(201);

      await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '카테고리 A',
          order: 0,
        })
        .expect(201);

      await testSuite
        .request()
        .post('/api/admin/electronic-disclosures/categories')
        .send({
          name: '카테고리 B',
          order: 1,
        })
        .expect(201);

      // When
      const listResponse = await testSuite
        .request()
        .get('/api/admin/electronic-disclosures/categories')
        .expect(200);

      // Then - order 순서대로 정렬되어 조회
      expect(listResponse.body.items).toHaveLength(3);
      expect(listResponse.body.items[0].name).toBe('카테고리 A');
      expect(listResponse.body.items[1].name).toBe('카테고리 B');
      expect(listResponse.body.items[2].name).toBe('카테고리 C');
    });
  });
});
