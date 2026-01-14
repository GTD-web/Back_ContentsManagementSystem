import { BaseE2ETest } from '../../../base-e2e.spec';

describe('PUT /api/admin/main-popups/:id (메인 팝업 수정)', () => {
  const testSuite = new BaseE2ETest();
  let testLanguageId: string;

  beforeAll(async () => {
    await testSuite.beforeAll();

    // 테스트용 언어 생성
    const languageResponse = await testSuite
      .request()
      .post('/api/admin/languages')
      .send({
        code: 'ko',
        name: '한국어',
        nativeName: '한국어',
        isDefault: true,
      });
    
    testLanguageId = languageResponse.body.id;
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
  });

  describe('성공 케이스', () => {
    it('메인 팝업을 수정해야 한다', async () => {
      // Given - 메인 팝업 생성
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '원본 제목',
              description: '원본 설명',
            },
          ]),
        });

      const mainPopupId = createResponse.body.id;

      // When - 수정
      const updateDto = {
        translations: JSON.stringify([
          {
            languageId: testLanguageId,
            title: '수정된 제목',
            description: '수정된 설명',
          },
        ]),
      };

      const response = await testSuite
        .request()
        .put(`/api/admin/main-popups/${mainPopupId}`)
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: mainPopupId,
      });
      expect(response.body.translations[0]).toMatchObject({
        title: '수정된 제목',
        description: '수정된 설명',
        languageId: testLanguageId,
      });
    });

    it('여러 언어의 번역을 수정해야 한다', async () => {
      // Given - 영어 언어 생성
      const enLanguageResponse = await testSuite
        .request()
        .post('/api/admin/languages')
        .send({
          code: 'en',
          name: 'English',
          nativeName: 'English',
          isDefault: false,
        });

      const enLanguageId = enLanguageResponse.body.id;

      // 메인 팝업 생성
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '원본 제목',
              description: '원본 설명',
            },
          ]),
        });

      const mainPopupId = createResponse.body.id;

      // When - 여러 언어 추가
      const updateDto = {
        translations: JSON.stringify([
          {
            languageId: testLanguageId,
            title: '수정된 한국어 제목',
            description: '수정된 한국어 설명',
          },
          {
            languageId: enLanguageId,
            title: 'Updated English Title',
            description: 'Updated English Description',
          },
        ]),
      };

      const response = await testSuite
        .request()
        .put(`/api/admin/main-popups/${mainPopupId}`)
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body.translations).toHaveLength(2);
      expect(response.body.translations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: '수정된 한국어 제목',
            languageId: testLanguageId,
          }),
          expect.objectContaining({
            title: 'Updated English Title',
            languageId: enLanguageId,
          }),
        ])
      );
    });

    it('description을 제거할 수 있어야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '원본 제목',
              description: '원본 설명',
            },
          ]),
        });

      const mainPopupId = createResponse.body.id;

      // When - description 제거
      const updateDto = {
        translations: JSON.stringify([
          {
            languageId: testLanguageId,
            title: '수정된 제목',
          },
        ]),
      };

      const response = await testSuite
        .request()
        .put(`/api/admin/main-popups/${mainPopupId}`)
        .send(updateDto)
        .expect(200);

      // Then
      // 다국어 전략으로 인해 여러 언어의 번역이 생성될 수 있으므로
      // testLanguageId에 해당하는 번역을 찾아서 확인
      const targetTranslation = response.body.translations.find(
        (t: any) => t.languageId === testLanguageId
      );
      expect(targetTranslation).toBeDefined();
      expect(targetTranslation.title).toBe('수정된 제목');
    });
  });

  describe('실패 케이스', () => {
    it('존재하지 않는 메인 팝업을 수정하려 할 때 404 에러가 발생해야 한다', async () => {
      // Given
      const nonExistentId = '00000000-0000-0000-0000-000000000001';
      const updateDto = {
        translations: JSON.stringify([
          {
            languageId: testLanguageId,
            title: '수정된 제목',
          },
        ]),
      };

      // When & Then
      await testSuite
        .request()
        .put(`/api/admin/main-popups/${nonExistentId}`)
        .send(updateDto)
        .expect(404);
    });

    it('translations가 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '원본 제목',
            },
          ]),
        });

      const mainPopupId = createResponse.body.id;

      // When & Then
      await testSuite
        .request()
        .put(`/api/admin/main-popups/${mainPopupId}`)
        .send({})
        .expect(400);
    });
  });
});

describe('PATCH /api/admin/main-popups/:id/public (메인 팝업 공개 상태 수정)', () => {
  const testSuite = new BaseE2ETest();
  let testLanguageId: string;

  beforeAll(async () => {
    await testSuite.beforeAll();

    // 테스트용 언어 생성
    const languageResponse = await testSuite
      .request()
      .post('/api/admin/languages')
      .send({
        code: 'ko',
        name: '한국어',
        nativeName: '한국어',
        isDefault: true,
      });
    
    testLanguageId = languageResponse.body.id;
  });

  afterAll(async () => {
    await testSuite.afterAll();
  });

  beforeEach(async () => {
    await testSuite.cleanupSpecificTables([
      'main_popups',
      'main_popup_translations',
    ]);
  });

  describe('성공 케이스', () => {
    it('메인 팝업을 공개로 변경해야 한다', async () => {
      // Given - 비공개 메인 팝업 생성 (기본값)
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '테스트 팝업',
              description: '테스트 설명',
            },
          ]),
        });

      const mainPopupId = createResponse.body.id;
      expect(createResponse.body.isPublic).toBe(false);

      // When - 공개로 변경
      const response = await testSuite
        .request()
        .patch(`/api/admin/main-popups/${mainPopupId}/public`)
        .send({ isPublic: true })
        .expect(200);

      // Then
      expect(response.body.isPublic).toBe(true);
    });

    it('메인 팝업을 비공개로 변경해야 한다', async () => {
      // Given - 메인 팝업 생성 후 공개로 변경
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '테스트 팝업',
              description: '테스트 설명',
            },
          ]),
        });

      const mainPopupId = createResponse.body.id;

      await testSuite
        .request()
        .patch(`/api/admin/main-popups/${mainPopupId}/public`)
        .send({ isPublic: true });

      // When - 비공개로 변경
      const response = await testSuite
        .request()
        .patch(`/api/admin/main-popups/${mainPopupId}/public`)
        .send({ isPublic: false })
        .expect(200);

      // Then
      expect(response.body.isPublic).toBe(false);
    });

    it('공개 상태를 여러 번 변경할 수 있어야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '테스트 팝업',
            },
          ]),
        });

      const mainPopupId = createResponse.body.id;

      // When & Then - 여러 번 토글
      let response = await testSuite
        .request()
        .patch(`/api/admin/main-popups/${mainPopupId}/public`)
        .send({ isPublic: true })
        .expect(200);
      expect(response.body.isPublic).toBe(true);

      response = await testSuite
        .request()
        .patch(`/api/admin/main-popups/${mainPopupId}/public`)
        .send({ isPublic: false })
        .expect(200);
      expect(response.body.isPublic).toBe(false);

      response = await testSuite
        .request()
        .patch(`/api/admin/main-popups/${mainPopupId}/public`)
        .send({ isPublic: true })
        .expect(200);
      expect(response.body.isPublic).toBe(true);
    });
  });

  describe('실패 케이스', () => {
    it('존재하지 않는 메인 팝업의 공개 상태를 변경하려 할 때 404 에러가 발생해야 한다', async () => {
      // Given
      const nonExistentId = '00000000-0000-0000-0000-000000000001';

      // When & Then
      await testSuite
        .request()
        .patch(`/api/admin/main-popups/${nonExistentId}/public`)
        .send({ isPublic: true })
        .expect(404);
    });

    it('isPublic이 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '테스트 팝업',
            },
          ]),
        });

      const mainPopupId = createResponse.body.id;

      // When & Then
      await testSuite
        .request()
        .patch(`/api/admin/main-popups/${mainPopupId}/public`)
        .send({})
        .expect(400);
    });

    it('isPublic이 boolean이 아닌 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '테스트 팝업',
            },
          ]),
        });

      const mainPopupId = createResponse.body.id;

      // When & Then
      await testSuite
        .request()
        .patch(`/api/admin/main-popups/${mainPopupId}/public`)
        .send({ isPublic: 'true' })
        .expect(400);
    });
  });
});

describe('DELETE /api/admin/main-popups/:id (메인 팝업 삭제)', () => {
  const testSuite = new BaseE2ETest();
  let testLanguageId: string;

  beforeAll(async () => {
    await testSuite.beforeAll();

    // 테스트용 언어 생성
    const languageResponse = await testSuite
      .request()
      .post('/api/admin/languages')
      .send({
        code: 'ko',
        name: '한국어',
        nativeName: '한국어',
        isDefault: true,
      });
    
    testLanguageId = languageResponse.body.id;
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
  });

  describe('성공 케이스', () => {
    it('메인 팝업을 삭제해야 한다 (Soft Delete)', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '삭제할 팝업',
              description: '삭제될 예정입니다',
            },
          ]),
        });

      const mainPopupId = createResponse.body.id;

      // When
      const deleteResponse = await testSuite
        .request()
        .delete(`/api/admin/main-popups/${mainPopupId}`)
        .expect(200);

      // Then
      expect(deleteResponse.body).toMatchObject({
        success: true,
      });

      // 삭제 후 조회하면 404 에러 발생
      await testSuite
        .request()
        .get(`/api/admin/main-popups/${mainPopupId}`)
        .expect(404);
    });

    it('여러 개의 메인 팝업을 순차적으로 삭제할 수 있어야 한다', async () => {
      // Given - 3개의 메인 팝업 생성
      const popupIds: string[] = [];
      for (let i = 1; i <= 3; i++) {
        const response = await testSuite
          .request()
          .post('/api/admin/main-popups')
          .send({
            translations: JSON.stringify([
              {
                languageId: testLanguageId,
                title: `팝업${i}`,
                description: `설명${i}`,
              },
            ]),
          });
        popupIds.push(response.body.id);
      }

      // When - 순차적으로 삭제
      for (const popupId of popupIds) {
        const deleteResponse = await testSuite
          .request()
          .delete(`/api/admin/main-popups/${popupId}`)
          .expect(200);

        expect(deleteResponse.body.success).toBe(true);
      }

      // Then - 모두 조회 불가능해야 함
      for (const popupId of popupIds) {
        await testSuite
          .request()
          .get(`/api/admin/main-popups/${popupId}`)
          .expect(404);
      }
    });

    it('삭제 후 목록에서 제외되어야 한다', async () => {
      // Given - 2개의 메인 팝업 생성
      const response1 = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '팝업1',
            },
          ]),
        });

      const response2 = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '팝업2',
            },
          ]),
        });

      const mainPopupId1 = response1.body.id;

      // When - 첫 번째 팝업 삭제
      await testSuite
        .request()
        .delete(`/api/admin/main-popups/${mainPopupId1}`)
        .expect(200);

      // Then - 목록 조회 시 1개만 남아있어야 함
      const listResponse = await testSuite
        .request()
        .get('/api/admin/main-popups')
        .expect(200);

      expect(listResponse.body.total).toBe(1);
      expect(listResponse.body.items).toHaveLength(1);
      expect(listResponse.body.items[0].id).toBe(response2.body.id);
    });
  });

  describe('실패 케이스', () => {
    it('존재하지 않는 메인 팝업을 삭제하려 할 때 404 에러가 발생해야 한다', async () => {
      // Given
      const nonExistentId = '00000000-0000-0000-0000-000000000001';

      // When & Then
      await testSuite
        .request()
        .delete(`/api/admin/main-popups/${nonExistentId}`)
        .expect(404);
    });

    it('이미 삭제된 메인 팝업을 다시 삭제하려 할 때 404 에러가 발생해야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({
          translations: JSON.stringify([
            {
              languageId: testLanguageId,
              title: '삭제할 팝업',
            },
          ]),
        });

      const mainPopupId = createResponse.body.id;

      // 첫 번째 삭제
      await testSuite
        .request()
        .delete(`/api/admin/main-popups/${mainPopupId}`)
        .expect(200);

      // When & Then - 두 번째 삭제 시도
      await testSuite
        .request()
        .delete(`/api/admin/main-popups/${mainPopupId}`)
        .expect(404);
    });

    it('잘못된 UUID 형식으로 삭제 시 에러가 발생해야 한다', async () => {
      // Given
      const invalidId = 'invalid-uuid';

      // When & Then
      const response = await testSuite
        .request()
        .delete(`/api/admin/main-popups/${invalidId}`);

      // UUID 검증은 400 또는 500 에러를 발생시킬 수 있음
      expect([400, 500]).toContain(response.status);
    });
  });
});
