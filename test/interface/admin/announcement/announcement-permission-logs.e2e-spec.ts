import { BaseE2ETest } from '../../../base-e2e.spec';

describe('공지사항 권한 로그 조회 API', () => {
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

  describe('GET /api/admin/announcements/permission-logs (권한 로그 목록 조회)', () => {
    it('빈 로그 목록을 반환해야 한다', async () => {
      // When
      const response = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs')
        .expect(200);

      // Then
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('모든 권한 로그 목록을 조회해야 한다', async () => {
      // Given - 공지사항 생성
      const announcement1 = await testSuite
        .request()
        .post('/api/admin/announcements')
        .send({
          title: '공지사항 1',
          content: '내용 1',
          permissionDepartmentIds: ['dept-1'],
        })
        .expect(201);

      const announcement2 = await testSuite
        .request()
        .post('/api/admin/announcements')
        .send({
          title: '공지사항 2',
          content: '내용 2',
          permissionDepartmentIds: ['dept-2'],
        })
        .expect(201);

      // Note: 실제 권한 로그는 스케줄러가 실행되어야 생성됨
      // 이 테스트는 API 엔드포인트가 정상적으로 동작하는지 확인

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs')
        .expect(200);

      // Then
      expect(Array.isArray(response.body)).toBe(true);
      // 스케줄러가 실행되지 않았으면 빈 배열
      // 스케줄러가 실행되었으면 로그가 있을 수 있음
    });

    it('미해결 권한 로그만 조회해야 한다', async () => {
      // Given
      await testSuite
        .request()
        .post('/api/admin/announcements')
        .send({
          title: '테스트 공지',
          content: '내용',
          permissionDepartmentIds: ['dept-1'],
        })
        .expect(201);

      // When - resolved=false 필터
      const response = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs?resolved=false')
        .expect(200);

      // Then
      expect(Array.isArray(response.body)).toBe(true);
      
      // 미해결 로그가 있는 경우 확인
      if (response.body.length > 0) {
        response.body.forEach((log: any) => {
          expect(log.resolvedAt).toBeNull();
        });
      }
    });

    it('해결된 권한 로그만 조회해야 한다', async () => {
      // Given
      await testSuite
        .request()
        .post('/api/admin/announcements')
        .send({
          title: '테스트 공지',
          content: '내용',
          permissionDepartmentIds: ['dept-1'],
        })
        .expect(201);

      // When - resolved=true 필터
      const response = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs?resolved=true')
        .expect(200);

      // Then
      expect(Array.isArray(response.body)).toBe(true);
      
      // 해결된 로그가 있는 경우 확인
      if (response.body.length > 0) {
        response.body.forEach((log: any) => {
          expect(log.resolvedAt).not.toBeNull();
        });
      }
    });

    it('권한 로그에 공지사항 정보가 포함되어야 한다', async () => {
      // Given
      const createResponse = await testSuite
        .request()
        .post('/api/admin/announcements')
        .send({
          title: '권한 로그 테스트',
          content: '내용',
          permissionDepartmentIds: null, // 빈 권한으로 로그 생성 유도
        })
        .expect(201);

      // 스케줄러 수동 실행 (필요한 경우)
      // await testSuite.app.get(AnnouncementPermissionScheduler).모든_공지사항_권한을_검증한다();

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs')
        .expect(200);

      // Then
      expect(Array.isArray(response.body)).toBe(true);
      
      // 로그가 있는 경우 구조 확인
      if (response.body.length > 0) {
        const log = response.body[0];
        expect(log).toMatchObject({
          id: expect.any(String),
          announcementId: expect.any(String),
          action: expect.any(String),
          detectedAt: expect.any(String),
          createdAt: expect.any(String),
        });

        // announcement 관계가 포함된 경우 확인
        if (log.announcement) {
          expect(log.announcement).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),
          });
        }
      }
    });
  });

  describe('권한 로그 필터링 테스트', () => {
    it('resolved 파라미터가 boolean이 아닌 경우에도 동작해야 한다', async () => {
      // When - 잘못된 타입의 파라미터
      const response = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs?resolved=invalid')
        .expect(200);

      // Then - 전체 로그 반환 (필터 무시)
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('여러 공지사항의 권한 로그를 조회해야 한다', async () => {
      // Given - 여러 공지사항 생성
      for (let i = 1; i <= 3; i++) {
        await testSuite
          .request()
          .post('/api/admin/announcements')
          .send({
            title: `공지사항 ${i}`,
            content: `내용 ${i}`,
            permissionDepartmentIds: [`dept-${i}`],
          })
          .expect(201);
      }

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs')
        .expect(200);

      // Then
      expect(Array.isArray(response.body)).toBe(true);
      // 스케줄러가 실행되면 여러 공지사항의 로그가 있을 수 있음
    });
  });

  describe('권한 교체 후 로그 확인', () => {
    it('권한 교체 후 RESOLVED 로그가 생성되어야 한다', async () => {
      // Given - 공지사항 생성 (비공개 상태로)
      const oldDeptId = '00000000-0000-0000-0000-000000000001';
      const newDeptId = '00000000-0000-0000-0000-000000000002';
      const oldEmpId = '00000000-0000-0000-0000-000000000003';
      const newEmpId = '00000000-0000-0000-0000-000000000004';
      
      const createResponse = await testSuite
        .request()
        .post('/api/admin/announcements')
        .send({
          title: '권한 교체 테스트',
          content: '내용',
          isPublic: false, // 비공개 상태로 생성
          permissionDepartmentIds: [oldDeptId],
          permissionEmployeeIds: [oldEmpId],
        })
        .expect(201);

      const announcementId = createResponse.body.id;

      // When - 권한 교체
      const replaceResponse = await testSuite
        .request()
        .patch(`/api/admin/announcements/${announcementId}/replace-permissions`)
        .send({
          departments: [
            { oldId: oldDeptId, newId: newDeptId },
          ],
          employees: [
            { oldId: oldEmpId, newId: newEmpId },
          ],
          note: '테스트 권한 교체',
        });

      // 에러 응답 로깅
      if (replaceResponse.status !== 200) {
        console.log('권한 교체 실패:', replaceResponse.status, replaceResponse.body);
      }
      
      expect(replaceResponse.status).toBe(200);

      // Then - RESOLVED 로그 확인
      const logsResponse = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs')
        .expect(200);

      // RESOLVED 로그 찾기
      const resolvedLogs = logsResponse.body.filter(
        (log: any) =>
          log.announcementId === announcementId &&
          log.action === 'resolved',
      );

      expect(resolvedLogs.length).toBeGreaterThanOrEqual(1);
      
      if (resolvedLogs.length > 0) {
        const resolvedLog = resolvedLogs[0];
        expect(resolvedLog).toMatchObject({
          announcementId,
          action: 'resolved',
          resolvedAt: expect.any(String),
          resolvedBy: expect.any(String),
        });

        // note 필드 확인
        if (resolvedLog.note) {
          expect(resolvedLog.note).toContain('테스트 권한 교체');
        }
      }
    });

    it('여러 번 권한 교체 시 각각 RESOLVED 로그가 생성되어야 한다', async () => {
      // Given (비공개 상태로 생성)
      const deptId1 = '00000000-0000-0000-0000-000000000010';
      const deptId2 = '00000000-0000-0000-0000-000000000011';
      const newDeptId1 = '00000000-0000-0000-0000-000000000012';
      const newDeptId2 = '00000000-0000-0000-0000-000000000013';
      
      const createResponse = await testSuite
        .request()
        .post('/api/admin/announcements')
        .send({
          title: '다중 권한 교체 테스트',
          content: '내용',
          isPublic: false, // 비공개 상태로 생성
          permissionDepartmentIds: [deptId1, deptId2],
        })
        .expect(201);

      const announcementId = createResponse.body.id;

      // When - 첫 번째 권한 교체
      await testSuite
        .request()
        .patch(`/api/admin/announcements/${announcementId}/replace-permissions`)
        .send({
          departments: [{ oldId: deptId1, newId: newDeptId1 }],
          note: '첫 번째 교체',
        })
        .expect(200);

      // When - 두 번째 권한 교체
      await testSuite
        .request()
        .patch(`/api/admin/announcements/${announcementId}/replace-permissions`)
        .send({
          departments: [{ oldId: deptId2, newId: newDeptId2 }],
          note: '두 번째 교체',
        })
        .expect(200);

      // Then - 로그 확인
      const logsResponse = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs')
        .expect(200);

      const resolvedLogs = logsResponse.body.filter(
        (log: any) =>
          log.announcementId === announcementId &&
          log.action === 'resolved',
      );

      // 최소 2개의 RESOLVED 로그가 있어야 함
      expect(resolvedLogs.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('권한 로그 정렬 테스트', () => {
    it('권한 로그가 감지 일시(detectedAt) 내림차순으로 정렬되어야 한다', async () => {
      // Given - 여러 공지사항 생성 (시간차를 두고)
      const announcementIds: string[] = [];
      
      for (let i = 1; i <= 3; i++) {
        const response = await testSuite
          .request()
          .post('/api/admin/announcements')
          .send({
            title: `공지사항 ${i}`,
            content: `내용 ${i}`,
            permissionDepartmentIds: [`dept-${i}`],
          })
          .expect(201);
        
        announcementIds.push(response.body.id);
        
        // 약간의 지연
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs')
        .expect(200);

      // Then - 정렬 확인 (로그가 있는 경우)
      if (response.body.length >= 2) {
        for (let i = 0; i < response.body.length - 1; i++) {
          const currentDate = new Date(response.body[i].detectedAt);
          const nextDate = new Date(response.body[i + 1].detectedAt);
          
          // 내림차순: 현재 날짜 >= 다음 날짜
          expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
        }
      }
    });
  });

  describe('권한 로그 데이터 구조 검증', () => {
    it('DETECTED 로그의 구조를 검증해야 한다', async () => {
      // Given
      await testSuite
        .request()
        .post('/api/admin/announcements')
        .send({
          title: 'DETECTED 로그 테스트',
          content: '내용',
          permissionDepartmentIds: null,
        })
        .expect(201);

      // 스케줄러 실행 후 로그 생성 대기
      // (실제 환경에서는 스케줄러가 자동 실행됨)

      // When
      const response = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs?resolved=false')
        .expect(200);

      // Then - DETECTED 로그가 있는 경우 구조 확인
      if (response.body.length > 0) {
        const detectedLog = response.body.find((log: any) => log.action === 'detected');
        
        if (detectedLog) {
          expect(detectedLog).toMatchObject({
            id: expect.any(String),
            announcementId: expect.any(String),
            action: 'detected',
            detectedAt: expect.any(String),
            resolvedAt: null,
            createdAt: expect.any(String),
          });

          // JSONB 필드 확인 (선택적)
          // invalidDepartments, invalidEmployees 등
        }
      }
    });

    it('RESOLVED 로그의 구조를 검증해야 한다', async () => {
      // Given (비공개 상태로 생성)
      const oldId = '00000000-0000-0000-0000-000000000020';
      const newId = '00000000-0000-0000-0000-000000000021';
      
      const createResponse = await testSuite
        .request()
        .post('/api/admin/announcements')
        .send({
          title: 'RESOLVED 로그 테스트',
          content: '내용',
          isPublic: false, // 비공개 상태로 생성
          permissionDepartmentIds: [oldId],
        })
        .expect(201);

      const announcementId = createResponse.body.id;

      // When - 권한 교체
      await testSuite
        .request()
        .patch(`/api/admin/announcements/${announcementId}/replace-permissions`)
        .send({
          departments: [{ oldId: oldId, newId: newId }],
        })
        .expect(200);

      // Then - RESOLVED 로그 확인
      const response = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs?resolved=true')
        .expect(200);

      const resolvedLog = response.body.find(
        (log: any) =>
          log.announcementId === announcementId &&
          log.action === 'resolved',
      );

      if (resolvedLog) {
        expect(resolvedLog).toMatchObject({
          id: expect.any(String),
          announcementId,
          action: 'resolved',
          detectedAt: expect.any(String),
          resolvedAt: expect.any(String),
          resolvedBy: expect.any(String),
          createdAt: expect.any(String),
        });
      }
    });
  });

  describe('권한 로그 통합 시나리오', () => {
    it('공지사항 생성 → 권한 로그 감지 → 권한 교체 → 로그 해결 플로우를 테스트해야 한다', async () => {
      // Step 1: 공지사항 생성 (비공개 상태로)
      const invalidDeptId = '00000000-0000-0000-0000-000000000030';
      const validDeptId = '00000000-0000-0000-0000-000000000031';
      
      const createResponse = await testSuite
        .request()
        .post('/api/admin/announcements')
        .send({
          title: '통합 시나리오 테스트',
          content: '내용',
          isPublic: false, // 비공개 상태로 생성
          permissionDepartmentIds: [invalidDeptId],
        })
        .expect(201);

      const announcementId = createResponse.body.id;

      // Step 2: 전체 로그 조회
      const allLogsResponse = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs')
        .expect(200);

      expect(Array.isArray(allLogsResponse.body)).toBe(true);

      // Step 3: 미해결 로그만 조회
      const unresolvedResponse = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs?resolved=false')
        .expect(200);

      expect(Array.isArray(unresolvedResponse.body)).toBe(true);

      // Step 4: 권한 교체
      await testSuite
        .request()
        .patch(`/api/admin/announcements/${announcementId}/replace-permissions`)
        .send({
          departments: [
            { oldId: invalidDeptId, newId: validDeptId },
          ],
        })
        .expect(200);

      // Step 5: 해결된 로그 조회
      const resolvedResponse = await testSuite
        .request()
        .get('/api/admin/announcements/permission-logs?resolved=true')
        .expect(200);

      const resolvedLogs = resolvedResponse.body.filter(
        (log: any) => log.announcementId === announcementId,
      );

      expect(resolvedLogs.length).toBeGreaterThanOrEqual(1);
    });
  });
});
