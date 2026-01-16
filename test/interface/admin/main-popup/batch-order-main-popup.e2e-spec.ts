import { BaseE2ETest } from '../../../base-e2e.spec';

describe('PUT /api/admin/main-popups/batch-order (메인 팝업 순서 일괄 수정)', () => {
  const testSuite = new BaseE2ETest();
  let testLanguageId: string;

  beforeAll(async () => {
    await testSuite.beforeAll();
  });

  afterAll(async () => {
    await testSuite.afterAll();
  });

  beforeEach(async () => {
    // 외래키 제약조건 때문에 순서 중요: 자식 테이블 먼저 삭제
    await testSuite.cleanupSpecificTables([
      'main_popup_translations',
      'main_popups',
    ]);

    // 이미 초기화된 한국어 언어를 조회
    const languagesResponse = await testSuite
      .request()
      .get('/api/admin/languages')
      .expect(200);

    const koreanLanguage = languagesResponse.body.items.find(
      (lang: any) => lang.code === 'ko',
    );

    testLanguageId = koreanLanguage.id;
  });

  describe('성공 케이스', () => {
    it('메인 팝업 순서를 일괄 수정해야 한다', async () => {
      // Given - 3개의 메인 팝업 생성
      const popups: any[] = [];
      for (let i = 1; i <= 3; i++) {
        const response = await testSuite
          .request()
          .post('/api/admin/main-popups')
          .field('translations', JSON.stringify([
            {
              languageId: testLanguageId,
              title: `팝업${i}`,
              description: `설명${i}`,
            },
          ]));
        
        if (response.status !== 201) {
          console.error(`❌ 메인 팝업 생성 실패 (status: ${response.status}):`, JSON.stringify(response.body, null, 2));
        }
        expect(response.status).toBe(201);
        popups.push(response.body);
      }

      // When - 순서 변경 (역순으로)
      const updateDto = {
        mainPopups: [
          { id: popups[2].id, order: 0 },
          { id: popups[1].id, order: 1 },
          { id: popups[0].id, order: 2 },
        ],
      };

      const response = await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        success: true,
        updatedCount: 3,
      });

      // 순서가 변경되었는지 확인
      const popup1 = await testSuite
        .request()
        .get(`/api/admin/main-popups/${popups[0].id}`)
        .expect(200);

      const popup2 = await testSuite
        .request()
        .get(`/api/admin/main-popups/${popups[1].id}`)
        .expect(200);

      const popup3 = await testSuite
        .request()
        .get(`/api/admin/main-popups/${popups[2].id}`)
        .expect(200);

      expect(popup1.body.order).toBe(2);
      expect(popup2.body.order).toBe(1);
      expect(popup3.body.order).toBe(0);
    });

    it('일부 메인 팝업의 순서만 수정해야 한다', async () => {
      // Given - 5개의 메인 팝업 생성
      const popups: any[] = [];
      for (let i = 1; i <= 5; i++) {
        const response = await testSuite
          .request()
          .post('/api/admin/main-popups')
          .field('translations', JSON.stringify([
            {
              languageId: testLanguageId,
              title: `팝업${i}`,
              description: `설명${i}`,
            },
          ]))
          .expect(201);
        popups.push(response.body);
      }

      // When - 3개만 순서 변경
      const updateDto = {
        mainPopups: [
          { id: popups[0].id, order: 10 },
          { id: popups[2].id, order: 20 },
          { id: popups[4].id, order: 30 },
        ],
      };

      const response = await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        success: true,
        updatedCount: 3,
      });
    });

    it('하나의 메인 팝업 순서를 수정해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .field('translations', JSON.stringify([
          {
            languageId: testLanguageId,
            title: '팝업1',
            description: '설명1',
          },
        ]))
        .expect(201);

      const mainPopupId = createResponse.body.id;

      // When
      const updateDto = {
        mainPopups: [{ id: mainPopupId, order: 100 }],
      };

      const response = await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        success: true,
        updatedCount: 1,
      });

      // 순서 확인
      const getResponse = await testSuite
        .request()
        .get(`/api/admin/main-popups/${mainPopupId}`)
        .expect(200);

      expect(getResponse.body.order).toBe(100);
    });

    it('순서를 여러 번 수정할 수 있어야 한다', async () => {
      // Given - 3개의 메인 팝업 생성
      const popups: any[] = [];
      for (let i = 1; i <= 3; i++) {
        const response = await testSuite
          .request()
          .post('/api/admin/main-popups')
          .field('translations', JSON.stringify([
            {
              languageId: testLanguageId,
              title: `팝업${i}`,
              description: `설명${i}`,
            },
          ]))
          .expect(201);
        popups.push(response.body);
      }

      // When - 첫 번째 순서 변경
      await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send({
          mainPopups: [
            { id: popups[0].id, order: 0 },
            { id: popups[1].id, order: 1 },
            { id: popups[2].id, order: 2 },
          ],
        })
        .expect(200);

      // When - 두 번째 순서 변경
      const response = await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send({
          mainPopups: [
            { id: popups[2].id, order: 0 },
            { id: popups[0].id, order: 1 },
            { id: popups[1].id, order: 2 },
          ],
        })
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        success: true,
        updatedCount: 3,
      });
    });
  });

  describe('실패 케이스', () => {
    it('빈 배열로 요청 시 400 에러가 발생해야 한다', async () => {
      // Given
      const updateDto = {
        mainPopups: [],
      };

      // When & Then
      await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send(updateDto)
        .expect(400);
    });

    it('mainPopups 필드가 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const updateDto = {};

      // When & Then
      await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send(updateDto)
        .expect(400);
    });

    it('존재하지 않는 ID가 포함된 경우 404 에러가 발생해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .field('translations', JSON.stringify([
          {
            languageId: testLanguageId,
            title: '팝업1',
            description: '설명1',
          },
        ]))
        .expect(201);

      const updateDto = {
        mainPopups: [
          { id: createResponse.body.id, order: 0 },
          { id: '00000000-0000-0000-0000-000000000001', order: 1 },
        ],
      };

      // When & Then
      await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send(updateDto)
        .expect(404);
    });

    it('잘못된 데이터 형식으로 요청 시 400 에러가 발생해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .field('translations', JSON.stringify([
          {
            languageId: testLanguageId,
            title: '팝업1',
            description: '설명1',
          },
        ]))
        .expect(201);

      const updateDto = {
        mainPopups: [
          { id: createResponse.body.id, order: 'not-a-number' }, // order가 숫자가 아님
        ],
      };

      // When & Then
      await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send(updateDto)
        .expect(400);
    });

    it('id 필드가 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const updateDto = {
        mainPopups: [{ order: 0 }], // id 누락
      };

      // When & Then
      await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send(updateDto)
        .expect(400);
    });

    it('order 필드가 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .field('translations', JSON.stringify([
          {
            languageId: testLanguageId,
            title: '팝업1',
            description: '설명1',
          },
        ]))
        .expect(201);

      const updateDto = {
        mainPopups: [{ id: createResponse.body.id }], // order 누락
      };

      // When & Then
      await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send(updateDto)
        .expect(400);
    });

    it('음수 order로 요청 시 400 에러가 발생해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .field('translations', JSON.stringify([
          {
            languageId: testLanguageId,
            title: '팝업1',
            description: '설명1',
          },
        ]))
        .expect(201);

      const updateDto = {
        mainPopups: [{ id: createResponse.body.id, order: -10 }],
      };

      // When & Then - 음수 order는 허용하지 않음
      await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send(updateDto)
        .expect(400);
    });
  });

  describe('중복 ID 테스트', () => {
    it('중복된 ID가 있어도 마지막 order로 업데이트되어야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .field('translations', JSON.stringify([
          {
            languageId: testLanguageId,
            title: '팝업1',
            description: '설명1',
          },
        ]))
        .expect(201);

      const mainPopupId = createResponse.body.id;
      expect(mainPopupId).toBeDefined();

      // When - 같은 ID를 다른 order로 여러 번 포함
      const updateDto = {
        mainPopups: [
          { id: mainPopupId, order: 10 },
          { id: mainPopupId, order: 20 },
          { id: mainPopupId, order: 30 },
        ],
      };

      const response = await testSuite
        .request()
        .put('/api/admin/main-popups/batch-order')
        .send(updateDto);

      // Then - 중복 ID는 허용되며, 마지막 order가 적용됨
      expect(response.status).toBe(200);

      if (response.status === 200) {
        // 최종 order 확인
        const getResponse = await testSuite
          .request()
          .get(`/api/admin/main-popups/${mainPopupId}`)
          .expect(200);

        // 마지막 order(30)가 적용되어야 함
        expect(getResponse.body.order).toBe(30);
      }
    });
  });
});
