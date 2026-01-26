import { BaseE2ETest } from '../../../base-e2e.spec';

describe('뉴스 카테고리 API (News Categories)', () => {
  const testSuite = new BaseE2ETest();

  beforeAll(async () => {
    await testSuite.beforeAll();
  });

  afterAll(async () => {
    await testSuite.afterAll();
  });

  beforeEach(async () => {
    // 카테고리 테이블만 정리 (뉴스는 카테고리와 관계 없음)
    await testSuite.cleanupSpecificTables(['categories']);
  });

  describe('GET /api/admin/news/categories (카테고리 목록 조회)', () => {
    it('뉴스 카테고리 목록을 조회해야 한다', async () => {
      // Given - 카테고리 생성
      await testSuite
        .request()
        .post('/api/admin/news/categories')
        .send({
          name: '프레스 릴리스',
          description: '언론 보도 자료',
        })
        .expect(201);

      await testSuite
        .request()
        .post('/api/admin/news/categories')
        .send({
          name: '수상 내역',
          description: '수상 관련 뉴스',
        })
        .expect(201);

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/news/categories')
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        items: expect.arrayContaining([
          expect.objectContaining({
            name: '프레스 릴리스',
            description: '언론 보도 자료',
          }),
          expect.objectContaining({
            name: '수상 내역',
            description: '수상 관련 뉴스',
          }),
        ]),
        total: 2,
      });
    });

    it('빈 카테고리 목록을 조회할 수 있어야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .get('/api/admin/news/categories')
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        items: [],
        total: 0,
      });
    });
  });

  describe('POST /api/admin/news/categories (카테고리 생성)', () => {
    it('뉴스 카테고리를 생성해야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .post('/api/admin/news/categories')
        .send({
          name: '신제품 발표',
          description: '신제품 관련 뉴스',
          isActive: true,
          order: 0,
        })
        .expect(201);

      // Then
      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: '신제품 발표',
        description: '신제품 관련 뉴스',
        isActive: true,
        order: 0,
        entityType: 'news',
      });
    });

    it('필수 필드만으로 카테고리를 생성해야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .post('/api/admin/news/categories')
        .send({
          name: '기본 카테고리',
        })
        .expect(201);

      // Then
      expect(response.body).toMatchObject({
        name: '기본 카테고리',
        isActive: true,
        entityType: 'news',
      });
    });

    it('name이 없으면 400을 반환해야 한다', async () => {
      // When & Then
      await testSuite
        .request()
        .post('/api/admin/news/categories')
        .send({
          description: '설명만 있음',
        })
        .expect(400);
    });
  });

  describe('PATCH /api/admin/news/categories/:id (카테고리 수정)', () => {
    it('뉴스 카테고리를 수정해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/news/categories')
        .send({
          name: '원본 카테고리',
          description: '원본 설명',
        })
        .expect(201);

      const categoryId = createResponse.body.id;

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/news/categories/${categoryId}`)
        .send({
          name: '수정된 카테고리',
          description: '수정된 설명',
        })
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: categoryId,
        name: '수정된 카테고리',
        description: '수정된 설명',
      });
    });

    it('일부 필드만 수정해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/news/categories')
        .send({
          name: '원본 카테고리',
          description: '원본 설명',
        })
        .expect(201);

      const categoryId = createResponse.body.id;

      // When - 이름만 수정
      const response = await testSuite
        .request()
        .patch(`/api/admin/news/categories/${categoryId}`)
        .send({
          name: '수정된 이름',
        })
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        name: '수정된 이름',
        description: '원본 설명',
      });
    });

    it('잘못된 UUID로 카테고리 수정 시 400을 반환해야 한다', async () => {
      // When & Then
      await testSuite
        .request()
        .patch('/api/admin/news/categories/non-existent-id')
        .send({
          name: '수정된 카테고리',
        })
        .expect(400);
    });
  });

  describe('PATCH /api/admin/news/categories/:id/order (카테고리 오더 변경)', () => {
    it('카테고리 오더를 변경해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/news/categories')
        .send({
          name: '테스트 카테고리',
          order: 0,
        })
        .expect(201);

      const categoryId = createResponse.body.id;

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/news/categories/${categoryId}/order`)
        .send({
          order: 10,
        })
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: categoryId,
        order: 10,
      });
    });

    it('order 필드가 없으면 400을 반환해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/news/categories')
        .send({
          name: '테스트 카테고리',
        })
        .expect(201);

      const categoryId = createResponse.body.id;

      // When & Then
      await testSuite
        .request()
        .patch(`/api/admin/news/categories/${categoryId}/order`)
        .send({})
        .expect(400);
    });

    it('잘못된 UUID로 카테고리 오더 변경 시 400을 반환해야 한다', async () => {
      // When & Then
      await testSuite
        .request()
        .patch('/api/admin/news/categories/non-existent-id/order')
        .send({
          order: 10,
        })
        .expect(400);
    });
  });

  describe('DELETE /api/admin/news/categories/:id (카테고리 삭제)', () => {
    it('뉴스 카테고리를 삭제해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/news/categories')
        .send({
          name: '삭제될 카테고리',
        })
        .expect(201);

      const categoryId = createResponse.body.id;

      // When
      const deleteResponse = await testSuite
        .request()
        .delete(`/api/admin/news/categories/${categoryId}`)
        .expect(200);

      // Then
      expect(deleteResponse.body).toMatchObject({
        success: true,
      });

      // 목록에서 사라졌는지 확인
      const listResponse = await testSuite
        .request()
        .get('/api/admin/news/categories')
        .expect(200);

      const deletedCategory = listResponse.body.items.find(
        (cat: any) => cat.id === categoryId,
      );
      expect(deletedCategory).toBeUndefined();
    });

    it('잘못된 UUID로 카테고리 삭제 시 400을 반환해야 한다', async () => {
      // When & Then
      await testSuite
        .request()
        .delete('/api/admin/news/categories/non-existent-id')
        .expect(400);
    });
  });

  describe('통합 시나리오', () => {
    it('카테고리 생성 -> 수정 -> 오더 변경 -> 삭제 전체 흐름이 동작해야 한다', async () => {
      // 1. 생성
      const createResponse = await testSuite
        .request()
        .post('/api/admin/news/categories')
        .send({
          name: '테스트 카테고리',
          description: '테스트 설명',
          order: 0,
        })
        .expect(201);

      const categoryId = createResponse.body.id;

      // 2. 조회
      const listResponse = await testSuite
        .request()
        .get('/api/admin/news/categories')
        .expect(200);

      expect(listResponse.body.items).toContainEqual(
        expect.objectContaining({
          id: categoryId,
          name: '테스트 카테고리',
        }),
      );

      // 3. 수정
      await testSuite
        .request()
        .patch(`/api/admin/news/categories/${categoryId}`)
        .send({
          name: '수정된 카테고리',
          description: '수정된 설명',
        })
        .expect(200);

      // 4. 오더 변경
      await testSuite
        .request()
        .patch(`/api/admin/news/categories/${categoryId}/order`)
        .send({
          order: 5,
        })
        .expect(200);

      // 5. 삭제
      await testSuite
        .request()
        .delete(`/api/admin/news/categories/${categoryId}`)
        .expect(200);

      // 6. 삭제 확인
      const finalListResponse = await testSuite
        .request()
        .get('/api/admin/news/categories')
        .expect(200);

      const deletedCategory = finalListResponse.body.items.find(
        (cat: any) => cat.id === categoryId,
      );
      expect(deletedCategory).toBeUndefined();
    });

    it('여러 카테고리를 생성하고 오더로 정렬할 수 있어야 한다', async () => {
      // Given - 3개의 카테고리 생성
      const categories: any[] = [];
      for (let i = 1; i <= 3; i++) {
        const response = await testSuite
          .request()
          .post('/api/admin/news/categories')
          .send({
            name: `카테고리${i}`,
            order: i,
          })
          .expect(201);
        categories.push(response.body as any);
      }

      // When - 오더 역순으로 변경
      await testSuite
        .request()
        .patch(`/api/admin/news/categories/${categories[0].id}/order`)
        .send({ order: 3 })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/news/categories/${categories[2].id}/order`)
        .send({ order: 1 })
        .expect(200);

      // Then - 목록 조회
      const listResponse = await testSuite
        .request()
        .get('/api/admin/news/categories')
        .expect(200);

      expect(listResponse.body.items.length).toBe(3);
    });
  });
});
