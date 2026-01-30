import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetAnnouncementListHandler,
  GetAnnouncementListQuery,
} from '@context/announcement-context/handlers/queries/get-announcement-list.handler';
import { Announcement } from '@domain/core/announcement/announcement.entity';

describe('GetAnnouncementListHandler', () => {
  let handler: GetAnnouncementListHandler;
  let announcementRepository: jest.Mocked<Repository<Announcement>>;

  const mockQueryBuilder: any = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockAnnouncementRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAnnouncementListHandler,
        {
          provide: getRepositoryToken(Announcement),
          useValue: mockAnnouncementRepository,
        },
      ],
    }).compile();

    handler = module.get<GetAnnouncementListHandler>(
      GetAnnouncementListHandler,
    );
    announcementRepository = module.get(getRepositoryToken(Announcement));

    // Reset mock after each test setup
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('기본 파라미터로 공지사항 목록을 조회해야 한다', async () => {
      // Given
      const query = new GetAnnouncementListQuery(
        undefined,
        undefined,
        'order',
        1,
        10,
      );

      const mockAnnouncements = [
        {
          id: 'announcement-1',
          categoryId: 'cat-1',
          category: { name: '일반 공지' },
          title: '테스트 공지',
          isFixed: false,
          isPublic: true,
          order: 1,
        } as Announcement,
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockAnnouncements,
        1,
      ]);

      // When
      const result = await handler.execute(query);

      // Then
      expect(announcementRepository.createQueryBuilder).toHaveBeenCalledWith(
        'announcement',
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'announcement.isFixed',
        'DESC',
      );
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith(
        'announcement.order',
        'DESC',
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'announcement.survey',
        'survey',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'announcement.category',
        'category',
      );
      expect(result).toEqual({
        items: mockAnnouncements,
        total: 1,
        page: 1,
        limit: 10,
      });
    });

    it('카테고리 ID로 필터링하여 조회해야 한다', async () => {
      // Given
      const categoryId = 'category-uuid-1';
      const query = new GetAnnouncementListQuery(
        undefined,
        undefined,
        'order',
        1,
        10,
        undefined,
        undefined,
        categoryId,
      );

      const mockAnnouncements = [
        {
          id: 'announcement-1',
          categoryId: 'category-uuid-1',
          category: { name: '일반 공지' },
          title: '테스트 공지',
          isFixed: false,
          isPublic: true,
          order: 1,
        } as Announcement,
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockAnnouncements,
        1,
      ]);

      // When
      const result = await handler.execute(query);

      // Then
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'announcement.categoryId = :categoryId',
        { categoryId: 'category-uuid-1' },
      );
      expect(result.items).toEqual(mockAnnouncements);
      expect(result.items[0].categoryId).toBe('category-uuid-1');
      expect(result.total).toBe(1);
    });

    it('공개 여부와 고정 여부로 필터링하여 조회해야 한다', async () => {
      // Given
      const query = new GetAnnouncementListQuery(true, false, 'order', 1, 10);

      const mockAnnouncements = [
        {
          id: 'announcement-1',
          title: '테스트 공지',
          isFixed: false,
          isPublic: true,
        } as Announcement,
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockAnnouncements,
        1,
      ]);

      // When
      const result = await handler.execute(query);

      // Then
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'announcement.isPublic = :isPublic',
        { isPublic: true },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.isFixed = :isFixed',
        { isFixed: false },
      );
      expect(result.items).toEqual(mockAnnouncements);
    });

    it('카테고리 ID와 공개 여부로 필터링하여 조회해야 한다', async () => {
      // Given
      const categoryId = 'category-uuid-1';
      const query = new GetAnnouncementListQuery(
        true,
        false,
        'order',
        1,
        10,
        undefined,
        undefined,
        categoryId,
      );

      const mockAnnouncements = [
        {
          id: 'announcement-1',
          categoryId: 'category-uuid-1',
          category: { name: '일반 공지' },
          title: '테스트 공지',
          isFixed: false,
          isPublic: true,
          order: 1,
        } as Announcement,
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockAnnouncements,
        1,
      ]);

      // When
      const result = await handler.execute(query);

      // Then
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'announcement.isPublic = :isPublic',
        { isPublic: true },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.isFixed = :isFixed',
        { isFixed: false },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.categoryId = :categoryId',
        { categoryId: 'category-uuid-1' },
      );
      expect(result.items).toEqual(mockAnnouncements);
      expect(result.items[0].categoryId).toBe('category-uuid-1');
    });

    it('날짜 범위로 필터링하여 조회해야 한다', async () => {
      // Given
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const query = new GetAnnouncementListQuery(
        undefined,
        undefined,
        'order',
        1,
        10,
        startDate,
        endDate,
      );

      const mockAnnouncements = [
        {
          id: 'announcement-1',
          title: '테스트 공지',
          createdAt: new Date('2024-06-15'),
        } as Announcement,
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockAnnouncements,
        1,
      ]);

      // When
      const result = await handler.execute(query);

      // Then
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'announcement.createdAt >= :startDate',
        { startDate },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'announcement.createdAt <= :endDate',
        { endDate },
      );
      expect(result.items).toEqual(mockAnnouncements);
    });

    it('생성일시 기준으로 정렬하여 조회해야 한다', async () => {
      // Given
      const query = new GetAnnouncementListQuery(
        undefined,
        undefined,
        'createdAt',
        1,
        10,
      );

      const mockAnnouncements = [
        {
          id: 'announcement-1',
          title: '테스트 공지',
          createdAt: new Date(),
        } as Announcement,
      ];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockAnnouncements,
        1,
      ]);

      // When
      const result = await handler.execute(query);

      // Then
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'announcement.isFixed',
        'DESC',
      );
      expect(mockQueryBuilder.addOrderBy).toHaveBeenCalledWith(
        'announcement.createdAt',
        'DESC',
      );
      expect(result.items).toEqual(mockAnnouncements);
    });

    it('페이지네이션을 올바르게 적용해야 한다', async () => {
      // Given
      const query = new GetAnnouncementListQuery(
        undefined,
        undefined,
        'order',
        2,
        5,
      );

      const mockAnnouncements = [] as Announcement[];

      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockAnnouncements,
        0,
      ]);

      // When
      const result = await handler.execute(query);

      // Then
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5); // (page-1) * limit = (2-1) * 5 = 5
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
    });
  });
});
