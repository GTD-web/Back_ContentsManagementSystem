import { Test, TestingModule } from '@nestjs/testing';
import {
  GetLumirStoryDetailHandler,
  GetLumirStoryDetailQuery,
} from '@context/lumir-story-context/handlers/queries/get-lumir-story-detail.handler';
import { LumirStoryService } from '@domain/sub/lumir-story/lumir-story.service';
import { LumirStory } from '@domain/sub/lumir-story/lumir-story.entity';

describe('GetLumirStoryDetailHandler', () => {
  let handler: GetLumirStoryDetailHandler;
  let lumirStoryService: jest.Mocked<LumirStoryService>;

  const mockLumirStoryService = {
    ID로_루미르스토리를_조회한다: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetLumirStoryDetailHandler,
        {
          provide: LumirStoryService,
          useValue: mockLumirStoryService,
        },
      ],
    }).compile();

    handler = module.get<GetLumirStoryDetailHandler>(
      GetLumirStoryDetailHandler,
    );
    lumirStoryService = module.get(LumirStoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('루미르스토리 상세 정보를 조회해야 한다', async () => {
      // Given
      const query = new GetLumirStoryDetailQuery('lumir-story-1');

      const mockLumirStory = {
        id: 'lumir-story-1',
        title: '루미르 스토리',
        content: '내용',
        isPublic: true,
        order: 0,
        imageUrl: null,
        attachments: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as LumirStory;

      mockLumirStoryService.ID로_루미르스토리를_조회한다.mockResolvedValue(
        mockLumirStory,
      );

      // When
      const result = await handler.execute(query);

      // Then
      expect(
        lumirStoryService.ID로_루미르스토리를_조회한다,
      ).toHaveBeenCalledWith('lumir-story-1');
      expect(result).toEqual(mockLumirStory);
    });
  });
});
