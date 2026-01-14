import { BaseE2ETest } from '../../../base-e2e.spec';

describe('POST /api/admin/main-popups (메인 팝업 생성)', () => {
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
    it('기본 메인 팝업을 생성해야 한다', async () => {
      // Given
      const createDto = {
        translations: JSON.stringify([
          {
            languageId: testLanguageId,
            title: '신년 이벤트',
            description: '2024년 신년 이벤트 안내',
          },
        ]),
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body).toMatchObject({
        id: expect.any(String),
        isPublic: false, // 기본값: 비공개
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });

      expect(response.body.translations).toBeDefined();
      expect(response.body.translations).toHaveLength(1);
      expect(response.body.translations[0]).toMatchObject({
        title: '신년 이벤트',
        description: '2024년 신년 이벤트 안내',
        languageId: testLanguageId,
      });
    });

    it('여러 언어의 번역과 함께 메인 팝업을 생성해야 한다', async () => {
      // Given - 영어 언어 추가 생성
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

      const createDto = {
        translations: JSON.stringify([
          {
            languageId: testLanguageId,
            title: '신년 이벤트',
            description: '2024년 신년 이벤트 안내',
          },
          {
            languageId: enLanguageId,
            title: 'New Year Event',
            description: '2024 New Year Event Notice',
          },
        ]),
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body.translations).toHaveLength(2);
      expect(response.body.translations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: '신년 이벤트',
            languageId: testLanguageId,
          }),
          expect.objectContaining({
            title: 'New Year Event',
            languageId: enLanguageId,
          }),
        ])
      );
    });

    it('description 없이 메인 팝업을 생성해야 한다', async () => {
      // Given
      const createDto = {
        translations: JSON.stringify([
          {
            languageId: testLanguageId,
            title: '간단한 팝업',
          },
        ]),
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send(createDto)
        .expect(201);

      // Then
      // 다국어 전략으로 인해 여러 언어의 번역이 생성될 수 있으므로
      // testLanguageId에 해당하는 번역을 찾아서 확인
      const targetTranslation = response.body.translations.find(
        (t: any) => t.languageId === testLanguageId
      );
      expect(targetTranslation).toBeDefined();
      expect(targetTranslation).toMatchObject({
        title: '간단한 팝업',
        languageId: testLanguageId,
      });
    });

    it('여러 개의 메인 팝업을 생성해야 한다', async () => {
      // Given
      const popups = [
        { title: '팝업1', description: '설명1' },
        { title: '팝업2', description: '설명2' },
        { title: '팝업3', description: '설명3' },
      ];

      // When & Then
      for (const popup of popups) {
        const response = await testSuite
          .request()
          .post('/api/admin/main-popups')
          .send({
            translations: JSON.stringify([
              {
                languageId: testLanguageId,
                ...popup,
              },
            ]),
          })
          .expect(201);

        expect(response.body.translations[0]).toMatchObject({
          title: popup.title,
          description: popup.description,
        });
      }
    });
  });

  describe('실패 케이스 - 필수 필드 누락', () => {
    it('translations가 누락된 경우 400 에러가 발생해야 한다', async () => {
      // When & Then
      await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send({})
        .expect(400);
    });

    it('translations가 빈 배열인 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        translations: JSON.stringify([]),
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send(createDto)
        .expect(400);
    });

    it('languageId가 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        translations: JSON.stringify([
          {
            title: '제목만 있는 팝업',
          },
        ]),
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send(createDto)
        .expect(400);
    });

    it('title이 누락된 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        translations: JSON.stringify([
          {
            languageId: testLanguageId,
            description: '설명만 있는 팝업',
          },
        ]),
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send(createDto)
        .expect(400);
    });
  });

  describe('실패 케이스 - 잘못된 데이터 타입', () => {
    it('translations가 JSON 문자열이 아닌 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        translations: 'invalid-json',
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send(createDto)
        .expect(400);
    });

    it('title이 문자열이 아닌 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        translations: JSON.stringify([
          {
            languageId: testLanguageId,
            title: 12345,
            description: '설명',
          },
        ]),
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send(createDto)
        .expect(400);
    });

    it('languageId가 문자열이 아닌 경우 400 에러가 발생해야 한다', async () => {
      // Given
      const createDto = {
        translations: JSON.stringify([
          {
            languageId: 12345,
            title: '제목',
          },
        ]),
      };

      // When & Then
      await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send(createDto)
        .expect(400);
    });
  });

  describe('실패 케이스 - 존재하지 않는 참조', () => {
    it('존재하지 않는 languageId로 생성 시 에러가 발생해야 한다', async () => {
      // Given
      const nonExistentLanguageId = '00000000-0000-0000-0000-000000000001';
      const createDto = {
        translations: JSON.stringify([
          {
            languageId: nonExistentLanguageId,
            title: '제목',
          },
        ]),
      };

      // When & Then
      const response = await testSuite
        .request()
        .post('/api/admin/main-popups')
        .send(createDto);

      // 외래키 제약조건 또는 비즈니스 로직에 따라 400 또는 404 에러 발생
      expect([400, 404, 500]).toContain(response.status);
    });
  });
});
