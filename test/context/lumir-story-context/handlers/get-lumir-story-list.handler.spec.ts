import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetLumirStoryListHandler,
  GetLumirStoryListQuery,
} from '@context/lumir-story-context/handlers/queries/get-lumir-story-list.handler';
import { LumirStory } from '@domain/sub/lumir-story/lumir-story.entity';

describe('GetLumirStoryListHandler', () => {
  let handler: GetLumirStoryListHandler;
  let lumirStoryRepository: jest.Mocked<Repository<LumirStory>>;

  const mockLumirStoryRepository = {
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetLumirStoryListHandler,
        {
          provide: getRepositoryToken(LumirStory),
          useValue: mockLumirStoryRepository,
        },
      ],
    }).compile();

    handler = module.get<GetLumirStoryListHandler>(GetLumirStoryListHandler);
    lumirStoryRepository = module.get(getRepositoryToken(LumirStory));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('루미르스토리 목록을 조회해야 한다', async () => {
      // Given
      const query = new GetLumirStoryListQuery(
        undefined,
        'order',
        1,
        10,
        undefined,
        undefined,
      );

      const mockLumirStories = [
        {
          id: 'lumir-story-1',
          title: '스토리 1',
          isPublic: true,
          order: 0,
        },
        {
          id: 'lumir-story-2',
          title: '스토리 2',
          isPublic: true,
          order: 1,
        },
      ] as LumirStory[];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockLumirStories, 2]),
      };

      mockLumirStoryRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // When
      const result = await handler.execute(query);

      // Then
      expect(lumirStoryRepository.createQueryBuilder).toHaveBeenCalledWith(
        'lumirStory',
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'lumirStory.order',
        'ASC',
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result).toEqual({
        items: mockLumirStories,
        total: 2,
        page: 1,
        limit: 10,
      });
    });

    it('공개된 루미르스토리만 조회해야 한다', async () => {
      // Given
      const query = new GetLumirStoryListQuery(true, 'order', 1, 10);

      const mockLumirStories = [
        {
          id: 'lumir-story-1',
          isPublic: true,
          order: 0,
        },
      ] as LumirStory[];

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([mockLumirStories, 1]),
      };

      mockLumirStoryRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // When
      await handler.execute(query);

      // Then
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'lumirStory.isPublic = :isPublic',
        { isPublic: true },
      );
    });

    it('생성일 기준으로 정렬해야 한다', async () => {
      // Given
      const query = new GetLumirStoryListQuery(
        undefined,
        'createdAt',
        1,
        10,
      );

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockLumirStoryRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // When
      await handler.execute(query);

      // Then
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'lumirStory.createdAt',
        'DESC',
      );
    });

    it('날짜 필터를 포함하여 조회해야 한다', async () => {
      // Given
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const query = new GetLumirStoryListQuery(
        undefined,
        'order',
        1,
        10,
        startDate,
        endDate,
      );

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockLumirStoryRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // When
      await handler.execute(query);

      // Then
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'lumirStory.createdAt >= :startDate',
        { startDate },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'lumirStory.createdAt <= :endDate',
        { endDate },
      );
    });

    it('페이지네이션을 적용해야 한다', async () => {
      // Given
      const query = new GetLumirStoryListQuery(undefined, 'order', 2, 5);

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };

      mockLumirStoryRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder as any,
      );

      // When
      await handler.execute(query);

      // Then
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(5); // (2 - 1) * 5
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(5);
    });
  });
});
