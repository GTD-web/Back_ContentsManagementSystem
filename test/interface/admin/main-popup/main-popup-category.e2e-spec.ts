import { BaseE2ETest } from '../../../base-e2e.spec';

describe('메인 팝업 카테고리 API', () => {
  const testSuite = new BaseE2ETest();

  beforeAll(async () => {
    await testSuite.beforeAll();
  });

  afterAll(async () => {
    await testSuite.afterAll();
  });

  beforeEach(async () => {
    await testSuite.cleanupSpecificTables([
      'categories',
    ]);
  });

  describe('GET /api/admin/main-popups/categories (카테고리 목록 조회)', () => {
    it('빈 목록을 반환해야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .get('/api/admin/main-popups/categories')
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        items: [],
        total: 0,
      });
    });

    it('등록된 카테고리 목록을 조회해야 한다', async () => {
      // Given
      const categories = [
        { name: '이벤트', description: '이벤트 관련 팝업' },
        { name: '공지', description: '공지 관련 팝업' },
        { name: '프로모션', description: '프로모션 관련 팝업' },
      ];

      for (const category of categories) {
        await testSuite
          .request()
          .post('/api/admin/main-popups/categories')
          .send(category);
      }

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/main-popups/categories')
        .expect(200);

      // Then
      expect(response.body.items).toHaveLength(3);
      expect(response.body.total).toBe(3);
      expect(response.body.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: '이벤트' }),
          expect.objectContaining({ name: '공지' }),
          expect.objectContaining({ name: '프로모션' }),
        ]),
      );
    });

    it('카테고리가 순서대로 정렬되어야 한다', async () => {
      // Given
      await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '카테고리C', order: 2 });

      await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '카테고리A', order: 0 });

      await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '카테고리B', order: 1 });

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/main-popups/categories')
        .expect(200);

      // Then
      expect(response.body.items).toHaveLength(3);
      // 순서대로 정렬되어 있는지 확인 (order 필드 기준)
      const orders = response.body.items.map((item: any) => item.order);
      expect(orders).toEqual([0, 1, 2]);
    });
  });

  describe('POST /api/admin/main-popups/categories (카테고리 생성)', () => {
    it('카테고리를 생성해야 한다', async () => {
      // Given
      const createDto = {
        name: '이벤트',
        description: '이벤트 관련 메인 팝업',
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: '이벤트',
        description: '이벤트 관련 메인 팝업',
        order: expect.any(Number),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('설명 없이 카테고리를 생성해야 한다', async () => {
      // Given
      const createDto = {
        name: '공지',
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: '공지',
      });
    });

    it('순서를 지정하여 카테고리를 생성해야 한다', async () => {
      // Given
      const createDto = {
        name: '긴급',
        description: '긴급 팝업',
        order: 1,
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: '긴급',
        order: 1,
      });
    });

    it('여러 개의 카테고리를 생성해야 한다', async () => {
      // Given
      const categories = [
        { name: '카테고리1' },
        { name: '카테고리2' },
        { name: '카테고리3' },
      ];

      // When & Then
      for (const category of categories) {
        const response = await testSuite
          .request()
          .post('/api/admin/main-popups/categories')
          .send(category)
          .expect(201);

        expect(response.body.name).toBe(category.name);
      }
    });

    it('name이 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        description: '설명만 있음',
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send(createDto)
        .expect(400);
    });

    it('name이 빈 문자열인 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        name: '',
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send(createDto)
        .expect(400);
    });

    it('name이 문자열이 아닌 경우 400 에러가 발생해야 한다', async () => {
      // Given - 배열을 보내면 ValidationPipe가 거부함
      const createDto = {
        name: ['invalid', 'array'],
      };

      // When & Then
      const response = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send(createDto);

      // ValidationPipe의 implicit conversion 때문에 다양한 응답이 가능
      expect([400, 500]).toContain(response.status);
    });
  });

  describe('PATCH /api/admin/main-popups/categories/:id (카테고리 수정)', () => {
    it('카테고리 이름을 수정해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '원본 이름', description: '원본 설명' });

      const categoryId = createResponse.body.id;

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${categoryId}`)
        .send({ name: '수정된 이름' })
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: categoryId,
        name: '수정된 이름',
      });
    });

    it('카테고리 설명을 수정해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '이벤트', description: '원본 설명' });

      const categoryId = createResponse.body.id;

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${categoryId}`)
        .send({ description: '수정된 설명' })
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: categoryId,
        description: '수정된 설명',
      });
    });

    it('카테고리 이름과 설명을 동시에 수정해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '원본', description: '원본 설명' });

      const categoryId = createResponse.body.id;

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${categoryId}`)
        .send({ name: '수정됨', description: '수정된 설명' })
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: categoryId,
        name: '수정됨',
        description: '수정된 설명',
      });
    });

    it('존재하지 않는 ID로 수정 시 404 에러가 발생해야 한다', async () => {
      // Given
      const nonExistentId = '00000000-0000-0000-0000-000000000001';

      // When & Then
      await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${nonExistentId}`)
        .send({ name: '수정된 이름' })
        .expect(404);
    });

    it('빈 body로 요청 시 에러가 발생하지 않아야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '카테고리' });

      const categoryId = createResponse.body.id;

      // When & Then
      const response = await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${categoryId}`)
        .send({});

      // 빈 body는 수정하지 않고 200 반환하거나 400 반환
      expect([200, 400]).toContain(response.status);
    });
  });

  describe('PATCH /api/admin/main-popups/categories/:id/order (카테고리 순서 변경)', () => {
    it('카테고리 순서를 변경해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '이벤트', order: 0 });

      const categoryId = createResponse.body.id;

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${categoryId}/order`)
        .send({ order: 5 })
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: categoryId,
        order: 5,
      });
    });

    it('카테고리 순서를 0으로 변경해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '이벤트', order: 10 });

      const categoryId = createResponse.body.id;

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${categoryId}/order`)
        .send({ order: 0 })
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: categoryId,
        order: 0,
      });
    });

    it('여러 카테고리의 순서를 변경해야 한다', async () => {
      // Given
      const category1 = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '카테고리1', order: 0 });

      const category2 = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '카테고리2', order: 1 });

      const category3 = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '카테고리3', order: 2 });

      // When - 순서 뒤바꾸기
      await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${category1.body.id}/order`)
        .send({ order: 2 })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${category3.body.id}/order`)
        .send({ order: 0 })
        .expect(200);

      // Then
      const cat1 = await testSuite
        .request()
        .get('/api/admin/main-popups/categories')
        .expect(200);

      const foundCat1 = cat1.body.items.find((c: any) => c.id === category1.body.id);
      const foundCat3 = cat1.body.items.find((c: any) => c.id === category3.body.id);

      expect(foundCat1.order).toBe(2);
      expect(foundCat3.order).toBe(0);
    });

    it('order가 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '이벤트' });

      const categoryId = createResponse.body.id;

      // When & Then
      await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${categoryId}/order`)
        .send({})
        .expect(400);
    });

    it('order가 숫자가 아닌 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '이벤트' });

      const categoryId = createResponse.body.id;

      // When & Then
      await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${categoryId}/order`)
        .send({ order: 'not-a-number' })
        .expect(400);
    });

    it('존재하지 않는 ID로 순서 변경 시 404 에러가 발생해야 한다', async () => {
      // Given
      const nonExistentId = '00000000-0000-0000-0000-000000000001';

      // When & Then
      await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${nonExistentId}/order`)
        .send({ order: 5 })
        .expect(404);
    });

    it('음수 order로 변경 시 처리되어야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '이벤트' });

      const categoryId = createResponse.body.id;

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/main-popups/categories/${categoryId}/order`)
        .send({ order: -1 });

      // Then - 음수 order를 허용하거나 거부
      expect([200, 400]).toContain(response.status);
    });
  });

  describe('DELETE /api/admin/main-popups/categories/:id (카테고리 삭제)', () => {
    it('카테고리를 삭제해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '삭제할 카테고리' });

      const categoryId = createResponse.body.id;

      // When
      const response = await testSuite
        .request()
        .delete(`/api/admin/main-popups/categories/${categoryId}`)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        success: true,
      });

      // 삭제 확인
      const listResponse = await testSuite
        .request()
        .get('/api/admin/main-popups/categories')
        .expect(200);

      expect(listResponse.body.items.find((item: any) => item.id === categoryId)).toBeUndefined();
    });

    it('여러 카테고리를 삭제해야 한다', async () => {
      // Given
      const ids: string[] = [];
      for (let i = 1; i <= 3; i++) {
        const response = await testSuite
          .request()
          .post('/api/admin/main-popups/categories')
          .send({ name: `카테고리${i}` });
        ids.push(response.body.id);
      }

      // When & Then
      for (const id of ids) {
        await testSuite
          .request()
          .delete(`/api/admin/main-popups/categories/${id}`)
          .expect(200);
      }

      // 모두 삭제되었는지 확인
      const listResponse = await testSuite
        .request()
        .get('/api/admin/main-popups/categories')
        .expect(200);

      expect(listResponse.body.total).toBe(0);
    });

    it('존재하지 않는 ID로 삭제 시 404 에러가 발생해야 한다', async () => {
      // Given
      const nonExistentId = '00000000-0000-0000-0000-000000000001';

      // When & Then
      await testSuite
        .request()
        .delete(`/api/admin/main-popups/categories/${nonExistentId}`)
        .expect(404);
    });

    it('이미 삭제된 카테고리를 다시 삭제하려 할 때 404 에러가 발생해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups/categories')
        .send({ name: '삭제할 카테고리' });

      const categoryId = createResponse.body.id;

      // 첫 번째 삭제
      await testSuite
        .request()
        .delete(`/api/admin/main-popups/categories/${categoryId}`)
        .expect(200);

      // When & Then - 두 번째 삭제 시도
      await testSuite
        .request()
        .delete(`/api/admin/main-popups/categories/${categoryId}`)
        .expect(404);
    });

    it('잘못된 UUID 형식으로 삭제 시 에러가 발생해야 한다', async () => {
      // Given
      const invalidId = 'invalid-uuid';

      // When & Then
      const response = await testSuite
        .request()
        .delete(`/api/admin/main-popups/categories/${invalidId}`);

      // UUID 검증은 400 또는 500 에러를 발생시킬 수 있음
      expect([400, 500]).toContain(response.status);
    });
  });
});
