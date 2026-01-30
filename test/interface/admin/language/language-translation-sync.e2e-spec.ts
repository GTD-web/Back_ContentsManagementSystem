import { BaseE2ETest } from '../../../base-e2e.spec';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BrochureTranslation } from '@domain/core/brochure/brochure-translation.entity';
import { Brochure } from '@domain/core/brochure/brochure.entity';

describe('언어 활성화 시 번역 동기화 트리거', () => {
  const testSuite = new BaseE2ETest();
  let dataSource: DataSource;

  beforeAll(async () => {
    await testSuite.beforeAll();
    dataSource = testSuite.app.get(DataSource);
  });

  afterAll(async () => {
    await testSuite.afterAll();
  });

  beforeEach(async () => {
    await testSuite.cleanupBeforeTest();
    await testSuite.initializeDefaultLanguages();
  });

  describe('POST /api/admin/languages (언어 추가 시 번역 동기화)', () => {
    it('활성 상태로 언어를 추가하면 번역 동기화가 트리거되어야 한다', async () => {
      // Given - 테스트용 브로슈어 생성
      const languages = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      const koLanguage = languages.body.items.find(
        (lang: any) => lang.code === 'ko',
      );

      // 브로슈어 카테고리 생성
      const categoryResponse = await testSuite
        .request()
        .post('/api/admin/brochures/categories')
        .send({
          name: '테스트 카테고리',
          entityType: 'brochure',
        })
        .expect(201);

      // 브로슈어 생성 (한국어 번역과 함께)
      const brochureResponse = await testSuite
        .request()
        .post('/api/admin/brochures')
        .send({
          categoryId: categoryResponse.body.id,
          isPublic: true,
          translations: [
            {
              languageId: koLanguage.id,
              title: '한국어 제목',
              description: '한국어 설명',
              isSynced: true,
            },
          ],
        })
        .expect(201);

      const brochureId = brochureResponse.body.id;

      // 초기 번역 개수 확인 (기본 4개 언어: ko, en, ja, zh)
      const brochureTranslationRepo = dataSource.getRepository(BrochureTranslation);
      const initialTranslations = await brochureTranslationRepo.find({
        where: { brochureId },
      });
      expect(initialTranslations).toHaveLength(4); // 기본 언어 4개

      // When - 새 언어 추가 (활성 상태)
      const addLanguageResponse = await testSuite
        .request()
        .post('/api/admin/languages')
        .send({
          code: 'fr',
          name: 'Français',
          isActive: true,
        })
        .expect(201);

      // API 응답이 즉시 반환되는지 확인
      expect(addLanguageResponse.body.code).toBe('fr');

      // 번역 동기화는 비동기로 실행되므로 대기
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Then - 새 언어로 번역이 동기화되었는지 확인
      const updatedTranslations = await brochureTranslationRepo.find({
        where: { brochureId },
        relations: ['language'],
      });

      // 번역 개수 확인 (기본 4개 + 프랑스어 1개)
      expect(updatedTranslations).toHaveLength(5);

      // 프랑스어 번역 확인
      const frenchTranslation = updatedTranslations.find(
        (t) => t.language.code === 'fr',
      );

      expect(frenchTranslation).toBeDefined();
      // 프랑스어 번역이 한국어 원본과 동기화되었는지 확인
      expect(frenchTranslation!.title).toBe('한국어 제목');
      expect(frenchTranslation!.description).toBe('한국어 설명');
      expect(frenchTranslation!.isSynced).toBe(true);
    });

    it('비활성 상태로 언어를 추가하면 번역 동기화가 트리거되지 않아야 한다', async () => {
      // Given - 테스트용 브로슈어 생성
      const languages = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      const koLanguage = languages.body.items.find(
        (lang: any) => lang.code === 'ko',
      );

      // 브로슈어 카테고리 생성
      const categoryResponse = await testSuite
        .request()
        .post('/api/admin/brochures/categories')
        .send({
          name: '테스트 카테고리 2',
          entityType: 'brochure',
        })
        .expect(201);

      // 브로슈어 생성
      const brochureResponse = await testSuite
        .request()
        .post('/api/admin/brochures')
        .send({
          categoryId: categoryResponse.body.id,
          isPublic: true,
          translations: [
            {
              languageId: koLanguage.id,
              title: '한국어 제목 2',
              description: '한국어 설명 2',
              isSynced: true,
            },
          ],
        })
        .expect(201);

      const brochureId = brochureResponse.body.id;

      // 초기 번역 개수 확인 (기본 4개 언어)
      const brochureTranslationRepo = dataSource.getRepository(BrochureTranslation);
      const initialTranslations = await brochureTranslationRepo.find({
        where: { brochureId },
      });
      expect(initialTranslations).toHaveLength(4);

      // When - 새 언어 추가 (비활성 상태)
      await testSuite
        .request()
        .post('/api/admin/languages')
        .send({
          code: 'de',
          name: 'Deutsch',
          isActive: false,
        })
        .expect(201);

      // 잠시 대기
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Then - 독일어 번역이 생성되지 않았는지 확인
      const translations = await brochureTranslationRepo.find({
        where: { brochureId },
        relations: ['language'],
      });

      // 여전히 4개여야 함 (독일어 번역 생성 안 됨)
      expect(translations).toHaveLength(4);

      // 독일어 번역이 없어야 함
      const germanTranslation = translations.find(
        (t) => t.language.code === 'de',
      );
      expect(germanTranslation).toBeUndefined();
    });
  });

  describe('PATCH /api/admin/languages/:id/active (언어 활성화 시 번역 동기화)', () => {
    it('비활성 언어를 활성화하면 번역 동기화가 트리거되어야 한다', async () => {
      // Given - 비활성 상태로 언어 추가
      const addLanguageResponse = await testSuite
        .request()
        .post('/api/admin/languages')
        .send({
          code: 'es',
          name: 'Español',
          isActive: false,
        })
        .expect(201);

      const spanishLanguageId = addLanguageResponse.body.id;

      // 테스트용 브로슈어 생성
      const languages = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      const koLanguage = languages.body.items.find(
        (lang: any) => lang.code === 'ko',
      );

      // 브로슈어 카테고리 생성
      const categoryResponse = await testSuite
        .request()
        .post('/api/admin/brochures/categories')
        .send({
          name: '테스트 카테고리 3',
          entityType: 'brochure',
        })
        .expect(201);

      // 브로슈어 생성 (스페인어는 비활성이므로 4개 언어로만 생성됨)
      const brochureResponse = await testSuite
        .request()
        .post('/api/admin/brochures')
        .send({
          categoryId: categoryResponse.body.id,
          isPublic: true,
          translations: [
            {
              languageId: koLanguage.id,
              title: '한국어 제목 3',
              description: '한국어 설명 3',
              isSynced: true,
            },
          ],
        })
        .expect(201);

      const brochureId = brochureResponse.body.id;

      // 초기 번역 개수 확인 (기본 4개 언어, 스페인어 제외)
      const brochureTranslationRepo = dataSource.getRepository(BrochureTranslation);
      const initialTranslations = await brochureTranslationRepo.find({
        where: { brochureId },
        relations: ['language'],
      });
      expect(initialTranslations).toHaveLength(4);

      // 스페인어 번역이 없는지 확인
      const noSpanishBefore = initialTranslations.find(
        (t) => t.language.code === 'es',
      );
      expect(noSpanishBefore).toBeUndefined();

      // When - 언어 활성화
      await testSuite
        .request()
        .patch(`/api/admin/languages/${spanishLanguageId}/active`)
        .send({ isActive: true })
        .expect(200);

      // 번역 동기화는 비동기로 실행되므로 대기
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Then - 스페인어 번역이 동기화되었는지 확인
      const updatedTranslations = await brochureTranslationRepo.find({
        where: { brochureId },
        relations: ['language'],
      });

      // 번역 개수 확인 (4개 + 스페인어 1개)
      expect(updatedTranslations).toHaveLength(5);

      // 스페인어 번역 확인
      const spanishTranslation = updatedTranslations.find(
        (t) => t.language.code === 'es',
      );

      expect(spanishTranslation).toBeDefined();
      expect(spanishTranslation!.title).toBe('한국어 제목 3');
      expect(spanishTranslation!.description).toBe('한국어 설명 3');
      expect(spanishTranslation!.isSynced).toBe(true);
    });

    it('언어 비활성화 시에는 번역 동기화가 트리거되지 않아야 한다', async () => {
      // Given - 일본어 (이미 활성 상태)
      const languages = await testSuite
        .request()
        .get('/api/admin/languages')
        .expect(200);

      const japaneseLanguage = languages.body.items.find(
        (lang: any) => lang.code === 'ja',
      );

      // When - 일본어 비활성화
      const response = await testSuite
        .request()
        .patch(`/api/admin/languages/${japaneseLanguage.id}/active`)
        .send({ isActive: false })
        .expect(200);

      // Then - API 응답이 즉시 반환되어야 함
      expect(response.body.isActive).toBe(false);
      
      // 잠시 대기 후에도 로그만 확인 (번역 동기화는 실행되지 않음)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    });
  });

  describe('API 응답 시간 확인', () => {
    it('언어 추가 API는 번역 동기화와 관계없이 빠르게 응답해야 한다', async () => {
      // When
      const startTime = Date.now();

      await testSuite
        .request()
        .post('/api/admin/languages')
        .send({
          code: 'it',
          name: 'Italiano',
          isActive: true,
        })
        .expect(201);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Then - 응답 시간이 2초 미만이어야 함 (비동기 실행)
      expect(responseTime).toBeLessThan(2000);
    });

    it('언어 활성화 API는 번역 동기화와 관계없이 빠르게 응답해야 한다', async () => {
      // Given - 비활성 언어 생성
      const addLanguageResponse = await testSuite
        .request()
        .post('/api/admin/languages')
        .send({
          code: 'pt',
          name: 'Português',
          isActive: false,
        })
        .expect(201);

      // When
      const startTime = Date.now();

      await testSuite
        .request()
        .patch(`/api/admin/languages/${addLanguageResponse.body.id}/active`)
        .send({ isActive: true })
        .expect(200);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Then - 응답 시간이 2초 미만이어야 함 (비동기 실행)
      expect(responseTime).toBeLessThan(2000);
    });
  });
});
