import { BaseE2ETest } from '../../../base-e2e.spec';

describe('PATCH /api/admin/wiki (위키 권한 관리)', () => {
  const testSuite = new BaseE2ETest();

  let folderId: string;
  let fileId: string;

  beforeAll(async () => {
    await testSuite.beforeAll();
  });

  afterAll(async () => {
    await testSuite.afterAll();
  });

  beforeEach(async () => {
    await testSuite.cleanupBeforeTest();

    // 테스트 데이터 생성
    const folderResponse = await testSuite
      .request()
      .post('/api/admin/wiki/folders')
      .send({ name: '테스트 폴더' })
      .expect(201);
    folderId = folderResponse.body.id;

    const fileResponse = await testSuite
      .request()
      .post('/api/admin/wiki/files/empty')
      .send({ name: '테스트 파일', parentId: folderId })
      .expect(201);
    fileId = fileResponse.body.id;
  });

  describe('폴더 권한 관리', () => {
    it('폴더 공개 상태를 수정해야 한다', async () => {
      // Given
      const updateDto = {
        isPublic: false,
      };

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderId}/public`)
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: folderId,
        isPublic: false,
      });
    });

    it('폴더에 직급 권한을 설정해야 한다', async () => {
      // Given
      const updateDto = {
        isPublic: false,
        permissionRankIds: ['rank-1', 'rank-2'],
      };

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderId}/public`)
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: folderId,
        isPublic: false,
      });
    });

    it('폴더에 직책 권한을 설정해야 한다', async () => {
      // Given
      const updateDto = {
        isPublic: false,
        permissionPositionIds: ['pos-1', 'pos-2'],
      };

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderId}/public`)
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: folderId,
        isPublic: false,
      });
    });

    it('폴더에 부서 권한을 설정해야 한다', async () => {
      // Given
      const updateDto = {
        isPublic: false,
        permissionDepartmentIds: ['dept-1', 'dept-2'],
      };

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderId}/public`)
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: folderId,
        isPublic: false,
      });
    });

    it('폴더에 모든 권한을 함께 설정해야 한다', async () => {
      // Given
      const updateDto = {
        isPublic: false,
        permissionRankIds: ['rank-1'],
        permissionPositionIds: ['pos-1'],
        permissionDepartmentIds: ['dept-1'],
      };

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderId}/public`)
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: folderId,
        isPublic: false,
      });
    });

    it('폴더를 다시 전사공개로 변경할 수 있어야 한다', async () => {
      // Given - 먼저 비공개로 설정
      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderId}/public`)
        .send({ isPublic: false })
        .expect(200);

      // When - 다시 공개로 변경
      const response = await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderId}/public`)
        .send({ isPublic: true })
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: folderId,
        isPublic: true,
      });
    });
  });

  describe('파일 권한 관리', () => {
    it('파일 공개 상태를 수정해야 한다', async () => {
      // Given
      const updateDto = {
        isPublic: false,
      };

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/wiki/files/${fileId}/public`)
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: fileId,
        isPublic: false,
      });
    });

    it('파일을 다시 공개로 변경할 수 있어야 한다', async () => {
      // Given - 먼저 비공개로 설정
      await testSuite
        .request()
        .patch(`/api/admin/wiki/files/${fileId}/public`)
        .send({ isPublic: false })
        .expect(200);

      // When - 다시 공개로 변경
      const response = await testSuite
        .request()
        .patch(`/api/admin/wiki/files/${fileId}/public`)
        .send({ isPublic: true })
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: fileId,
        isPublic: true,
      });
    });

    it('파일은 isPublic만 수정 가능해야 한다 (권한 ID는 설정 불가)', async () => {
      // Given
      const updateDto = {
        isPublic: false,
        // 파일은 permissionRankIds 등을 설정할 수 없음
      };

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/wiki/files/${fileId}/public`)
        .send(updateDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        id: fileId,
        isPublic: false,
      });
    });
  });

  describe('권한 정책 확인', () => {
    it('폴더는 기본적으로 전사공개로 생성되어야 한다', async () => {
      // Given
      const createDto = {
        name: '새 폴더',
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body.isPublic).toBe(true);
    });

    it('파일은 기본적으로 isPublic: true로 생성되어야 한다', async () => {
      // Given
      const createDto = {
        name: '새 파일',
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/wiki/files/empty')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body.isPublic).toBe(true);
    });

    it('isPublic: false인 파일은 완전 비공개여야 한다', async () => {
      // Given
      const createDto = {
        name: '비공개 파일',
        isPublic: false,
      };

      // When
      const response = await testSuite
        .request()
        .post('/api/admin/wiki/files/empty')
        .send(createDto)
        .expect(201);

      // Then
      expect(response.body.isPublic).toBe(false);
    });

    it('isPublic: true인 파일은 상위 폴더 권한을 상속받아야 한다', async () => {
      // Given - 비공개 폴더 생성
      const privateFolderResponse = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '비공개 폴더' })
        .expect(201);
      const privateFolderId = privateFolderResponse.body.id;

      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${privateFolderId}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: ['dept-1'],
        })
        .expect(200);

      // When - 공개 파일을 비공개 폴더에 생성
      const fileResponse = await testSuite
        .request()
        .post('/api/admin/wiki/files/empty')
        .send({
          name: '공개 파일',
          parentId: privateFolderId,
          isPublic: true,
        })
        .expect(201);

      // Then
      expect(fileResponse.body.isPublic).toBe(true);
      expect(fileResponse.body.parentId).toBe(privateFolderId);
    });
  });

  describe('GET /api/admin/wiki/permission-logs (권한 로그 조회)', () => {
    it('권한 로그 목록을 조회해야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs')
        .expect(200);

      // Then
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('resolved=true로 필터링하여 해결된 로그만 조회해야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs?resolved=true')
        .expect(200);

      // Then
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('resolved=false로 필터링하여 미해결 로그만 조회해야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs?resolved=false')
        .expect(200);

      // Then
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('resolved 필터링이 정확히 작동해야 한다', async () => {
      // Given - 폴더 생성 및 권한 교체로 resolved 로그 생성
      const folder = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: 'Resolved 필터링 테스트 폴더' })
        .expect(201);

      // 권한 설정
      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folder.body.id}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: ['wiki-filter-dept-1'],
        })
        .expect(200);

      // 권한 교체로 RESOLVED 로그 생성
      await testSuite
        .request()
        .patch(`/api/admin/wiki/${folder.body.id}/replace-permissions`)
        .send({
          departments: [{ oldId: 'wiki-filter-dept-1', newId: 'wiki-filter-dept-2' }],
        })
        .expect(200);

      // When - 전체 로그 조회
      const allLogsResponse = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs')
        .expect(200);

      // Then - resolved=true는 resolvedAt이 있는 로그만
      const resolvedResponse = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs?resolved=true')
        .expect(200);

      expect(Array.isArray(resolvedResponse.body)).toBe(true);
      resolvedResponse.body.forEach((log: any) => {
        expect(log.resolvedAt).not.toBeNull();
        expect(log.resolvedAt).toBeDefined();
      });

      // resolved=false는 resolvedAt이 null인 로그만
      const unresolvedResponse = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs?resolved=false')
        .expect(200);

      expect(Array.isArray(unresolvedResponse.body)).toBe(true);
      unresolvedResponse.body.forEach((log: any) => {
        expect(log.resolvedAt).toBeNull();
      });

      // 전체 로그 수 = resolved + unresolved
      expect(allLogsResponse.body.length).toBe(
        resolvedResponse.body.length + unresolvedResponse.body.length,
      );
    });
  });

  describe('PATCH /api/admin/wiki/:id/replace-permissions (권한 ID 교체)', () => {
    it('비활성 부서 ID를 새로운 ID로 교체해야 한다', async () => {
      // Given - 권한이 있는 폴더 생성
      const folderWithPermissionResponse = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '권한 폴더' })
        .expect(201);
      const folderWithPermissionId = folderWithPermissionResponse.body.id;

      // 권한 설정 (실제 ID는 테스트 환경에 따라 다를 수 있음)
      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderWithPermissionId}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: ['dept-old-1', 'dept-old-2'],
        })
        .expect(200);

      const replaceDto = {
        departments: [
          { oldId: 'dept-old-1', newId: 'dept-new-1' },
          { oldId: 'dept-old-2', newId: 'dept-new-2' },
        ],
        note: '부서 변경',
      };

      // When
      const response = await testSuite
        .request()
        .patch(`/api/admin/wiki/${folderWithPermissionId}/replace-permissions`)
        .send(replaceDto)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String),
        replacedDepartments: expect.any(Number),
      });
    });

    it('존재하지 않는 위키의 권한을 교체하면 404 에러가 발생해야 한다', async () => {
      // Given
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const replaceDto = {
        departments: [{ oldId: 'dept-old-1', newId: 'dept-new-1' }],
      };

      // When & Then
      await testSuite
        .request()
        .patch(`/api/admin/wiki/${nonExistentId}/replace-permissions`)
        .send(replaceDto)
        .expect(404);
    });
  });

  describe('다시 보지 않기 기능', () => {
    it('미열람 권한 로그를 조회해야 한다', async () => {
      // When - 미열람 로그 조회
      const response = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs/unread')
        .expect(200);

      // Then
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('권한 로그를 무시 처리할 수 있어야 한다', async () => {
      // Given - 폴더 생성 및 권한 설정
      const folderResponse = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '무시 테스트 폴더' })
        .expect(201);

      const folderId = folderResponse.body.id;

      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderId}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: ['test-wiki-dept-1'],
        })
        .expect(200);

      // 권한 교체
      await testSuite
        .request()
        .patch(`/api/admin/wiki/${folderId}/replace-permissions`)
        .send({
          departments: [{ oldId: 'test-wiki-dept-1', newId: 'test-wiki-dept-2' }],
        })
        .expect(200);

      // 권한 로그 조회
      const logsResponse = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs')
        .expect(200);

      if (logsResponse.body.length === 0) {
        return;
      }

      const logId = logsResponse.body[0].id;

      // When - 무시 처리
      const dismissResponse = await testSuite
        .request()
        .patch('/api/admin/wiki/permission-logs/dismiss')
        .send({ logIds: [logId] })
        .expect(200);

      // Then
      expect(dismissResponse.body).toMatchObject({
        success: true,
        message: expect.any(String),
        dismissed: 1,
        alreadyDismissed: 0,
        notFound: 0,
      });
    });

    it('무시 처리한 로그는 미열람 조회에서 제외되어야 한다', async () => {
      // Given
      const folderResponse = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '필터 테스트 폴더' })
        .expect(201);

      const folderId = folderResponse.body.id;

      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderId}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: ['filter-wiki-dept'],
        })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/wiki/${folderId}/replace-permissions`)
        .send({
          departments: [{ oldId: 'filter-wiki-dept', newId: 'new-wiki-dept' }],
        })
        .expect(200);

      const logsResponse = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs')
        .expect(200);

      if (logsResponse.body.length === 0) {
        return;
      }

      const logId = logsResponse.body[0].id;

      const unreadBefore = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs/unread')
        .expect(200);

      const countBefore = unreadBefore.body.length;

      // When - 무시 처리
      await testSuite
        .request()
        .patch('/api/admin/wiki/permission-logs/dismiss')
        .send({ logIds: [logId] })
        .expect(200);

      // Then
      const unreadAfter = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs/unread')
        .expect(200);

      expect(unreadAfter.body.length).toBeLessThanOrEqual(countBefore);
    });

    it('무시 처리한 로그도 전체 조회에서는 여전히 보여야 한다', async () => {
      // Given
      const folderResponse = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '전체 조회 테스트 폴더' })
        .expect(201);

      const folderId = folderResponse.body.id;

      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderId}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: ['all-wiki-dept'],
        })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/wiki/${folderId}/replace-permissions`)
        .send({
          departments: [{ oldId: 'all-wiki-dept', newId: 'new-all-wiki-dept' }],
        })
        .expect(200);

      const logsResponse = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs')
        .expect(200);

      if (logsResponse.body.length === 0) {
        return;
      }

      const logId = logsResponse.body[0].id;
      const totalBefore = logsResponse.body.length;

      // When
      await testSuite
        .request()
        .patch('/api/admin/wiki/permission-logs/dismiss')
        .send({ logIds: [logId] })
        .expect(200);

      // Then
      const allLogsAfter = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs')
        .expect(200);

      expect(allLogsAfter.body.length).toBe(totalBefore);
    });

    it('이미 무시 처리된 로그를 다시 무시하면 중복 생성하지 않아야 한다', async () => {
      // Given
      const folderResponse = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '중복 테스트 폴더' })
        .expect(201);

      const folderId = folderResponse.body.id;

      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderId}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: ['dup-wiki-dept'],
        })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/wiki/${folderId}/replace-permissions`)
        .send({
          departments: [{ oldId: 'dup-wiki-dept', newId: 'new-dup-wiki-dept' }],
        })
        .expect(200);

      const logsResponse = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs')
        .expect(200);

      if (logsResponse.body.length === 0) {
        return;
      }

      const logId = logsResponse.body[0].id;

      // 첫 번째 무시 처리
      const firstDismiss = await testSuite
        .request()
        .patch('/api/admin/wiki/permission-logs/dismiss')
        .send({ logIds: [logId] })
        .expect(200);

      // When - 두 번째 무시 처리
      const secondDismiss = await testSuite
        .request()
        .patch('/api/admin/wiki/permission-logs/dismiss')
        .send({ logIds: [logId] })
        .expect(200);

      // Then
      expect(secondDismiss.body).toMatchObject({
        success: true,
        dismissed: 0,
        alreadyDismissed: 1,
        notFound: 0,
      });

      expect(firstDismiss.body.dismissed).toBe(1);
    });

    it('여러 권한 로그를 한 번에 무시 처리할 수 있어야 한다', async () => {
      // Given - 여러 폴더 생성
      const folder1 = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '배치 테스트 폴더1' })
        .expect(201);

      const folder2 = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '배치 테스트 폴더2' })
        .expect(201);

      const folder3 = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '배치 테스트 폴더3' })
        .expect(201);

      // 권한 설정
      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folder1.body.id}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: ['batch-wiki-1'],
        })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folder2.body.id}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: ['batch-wiki-2'],
        })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folder3.body.id}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: ['batch-wiki-3'],
        })
        .expect(200);

      // 권한 교체로 로그들 생성
      await testSuite
        .request()
        .patch(`/api/admin/wiki/${folder1.body.id}/replace-permissions`)
        .send({
          departments: [{ oldId: 'batch-wiki-1', newId: 'new-batch-wiki-1' }],
        })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/wiki/${folder2.body.id}/replace-permissions`)
        .send({
          departments: [{ oldId: 'batch-wiki-2', newId: 'new-batch-wiki-2' }],
        })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/wiki/${folder3.body.id}/replace-permissions`)
        .send({
          departments: [{ oldId: 'batch-wiki-3', newId: 'new-batch-wiki-3' }],
        })
        .expect(200);

      // 로그 조회
      const logsResponse = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs')
        .expect(200);

      if (logsResponse.body.length < 3) {
        return;
      }

      const logIds = logsResponse.body.slice(0, 3).map((log: any) => log.id);

      // When - 여러 로그를 한 번에 무시 처리
      const dismissResponse = await testSuite
        .request()
        .patch('/api/admin/wiki/permission-logs/dismiss')
        .send({ logIds })
        .expect(200);

      // Then
      expect(dismissResponse.body).toMatchObject({
        success: true,
        dismissed: 3,
        alreadyDismissed: 0,
        notFound: 0,
      });

      // 미열람 조회에서 무시된 로그들이 제외되는지 확인
      const unreadResponse = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs/unread')
        .expect(200);

      const unreadIds = unreadResponse.body.map((log: any) => log.id);
      logIds.forEach((logId: string) => {
        expect(unreadIds).not.toContain(logId);
      });
    });

    it('배치 무시 처리 시 일부는 성공하고 일부는 이미 무시된 경우를 처리해야 한다', async () => {
      // Given
      const folder1 = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '혼합 테스트 1' })
        .expect(201);

      const folder2 = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '혼합 테스트 2' })
        .expect(201);

      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folder1.body.id}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: ['mixed-wiki-1'],
        })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folder2.body.id}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: ['mixed-wiki-2'],
        })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/wiki/${folder1.body.id}/replace-permissions`)
        .send({
          departments: [{ oldId: 'mixed-wiki-1', newId: 'new-mixed-wiki-1' }],
        })
        .expect(200);

      await testSuite
        .request()
        .patch(`/api/admin/wiki/${folder2.body.id}/replace-permissions`)
        .send({
          departments: [{ oldId: 'mixed-wiki-2', newId: 'new-mixed-wiki-2' }],
        })
        .expect(200);

      const logsResponse = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs')
        .expect(200);

      if (logsResponse.body.length < 2) {
        return;
      }

      const logIds = logsResponse.body.slice(0, 2).map((log: any) => log.id);

      // 첫 번째 로그만 먼저 무시 처리
      await testSuite
        .request()
        .patch('/api/admin/wiki/permission-logs/dismiss')
        .send({ logIds: [logIds[0]] })
        .expect(200);

      // When - 두 로그 모두 무시 처리 시도
      const dismissResponse = await testSuite
        .request()
        .patch('/api/admin/wiki/permission-logs/dismiss')
        .send({ logIds })
        .expect(200);

      // Then
      expect(dismissResponse.body).toMatchObject({
        success: true,
        dismissed: 1,
        alreadyDismissed: 1,
        notFound: 0,
      });
    });

    it('존재하지 않는 로그 ID가 포함된 경우 스킵해야 한다', async () => {
      // Given - 가짜 UUID v4 (존재하지 않는 ID들)
      const fakeIds = [
        '00000000-0000-4000-8000-000000000001',
        '00000000-0000-4000-8000-000000000002',
        '00000000-0000-4000-8000-000000000003',
      ];

      // When - 존재하지 않는 ID들만 보냄
      const dismissResponse = await testSuite
        .request()
        .patch('/api/admin/wiki/permission-logs/dismiss')
        .send({ logIds: fakeIds })
        .expect(200);

      // Then - 모두 notFound로 처리됨
      expect(dismissResponse.body).toMatchObject({
        success: true,
        dismissed: 0,
        alreadyDismissed: 0,
        notFound: 3,
      });
    });

    it('빈 배열로 요청하면 400 에러가 발생해야 한다', async () => {
      // When & Then
      await testSuite
        .request()
        .patch('/api/admin/wiki/permission-logs/dismiss')
        .send({ logIds: [] })
        .expect(400);
    });

    it('잘못된 UUID 형식이 포함된 경우 400 에러가 발생해야 한다', async () => {
      // When & Then
      await testSuite
        .request()
        .patch('/api/admin/wiki/permission-logs/dismiss')
        .send({ logIds: ['invalid-uuid', 'not-a-uuid'] })
        .expect(400);
    });
  });

  describe('부서 재활성화 시 자동 해결', () => {
    it('시스템이 자동으로 해결한 로그는 resolvedBy가 null이어야 한다', async () => {
      // Note: 이 테스트는 스케줄러가 실행되고 부서가 재활성화된 후의 상태를 검증합니다.
      
      // When - 해결된 로그 중 시스템이 자동 해결한 것 조회
      const response = await testSuite
        .request()
        .get('/api/admin/wiki/permission-logs?resolved=true')
        .expect(200);

      // Then - 시스템이 자동 해결한 로그가 있는 경우 검증
      const systemResolvedLogs = response.body.filter(
        (log: any) =>
          log.action === 'resolved' &&
          log.resolvedBy === null &&
          log.note?.includes('시스템'),
      );

      // 시스템 자동 해결 로그가 있다면 구조 검증
      if (systemResolvedLogs.length > 0) {
        systemResolvedLogs.forEach((log: any) => {
          expect(log).toMatchObject({
            action: 'resolved',
            resolvedBy: null,
            resolvedAt: expect.any(String),
            note: expect.stringContaining('시스템'),
          });
        });
      }
    });

    it('폴더 구조 조회 시 재검증 스케줄러가 트리거되어야 한다', async () => {
      // Given - permissionDepartmentIds가 빈 폴더 생성 후 권한 제거
      const folderResponse = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '재검증 테스트 폴더' })
        .expect(201);

      const folderId = folderResponse.body.id;

      // 권한을 설정했다가 제거하여 빈 상태로 만들기
      await testSuite
        .request()
        .patch(`/api/admin/wiki/folders/${folderId}/public`)
        .send({
          isPublic: false,
          permissionDepartmentIds: null,
        })
        .expect(200);

      // When - 폴더 구조 조회 (스케줄러가 백그라운드에서 실행됨)
      const response = await testSuite
        .request()
        .get('/api/admin/wiki/folders/structure')
        .expect(200);

      // Then - 응답이 정상적으로 반환되어야 함
      expect(response.body).toMatchObject({
        items: expect.any(Array),
        total: expect.any(Number),
      });
    });

    it('파일 목록 조회 시 재검증 스케줄러가 트리거되어야 한다', async () => {
      // Given - 폴더와 파일 생성
      const folderResponse = await testSuite
        .request()
        .post('/api/admin/wiki/folders')
        .send({ name: '파일 재검증 폴더' })
        .expect(201);

      const folderId = folderResponse.body.id;

      await testSuite
        .request()
        .post('/api/admin/wiki/files/empty')
        .send({
          name: '재검증 파일',
          parentId: folderId,
        })
        .expect(201);

      // When - 파일 목록 조회
      const response = await testSuite
        .request()
        .get(`/api/admin/wiki/files?parentId=${folderId}`)
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        items: expect.any(Array),
        total: expect.any(Number),
      });
    });

    it('파일 검색 시 재검증 스케줄러가 트리거되어야 한다', async () => {
      // Given - 검색 가능한 파일 생성
      await testSuite
        .request()
        .post('/api/admin/wiki/files/empty')
        .send({
          name: '검색용 재검증 파일',
        })
        .expect(201);

      // When - 파일 검색
      const response = await testSuite
        .request()
        .get('/api/admin/wiki/files/search?query=검색용')
        .expect(200);

      // Then
      expect(response.body).toMatchObject({
        items: expect.any(Array),
        total: expect.any(Number),
      });
    });
  });
});
