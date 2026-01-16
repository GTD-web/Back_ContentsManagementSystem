import { Test, TestingModule } from '@nestjs/testing';
import {
  UpdateLumirStoryHandler,
  UpdateLumirStoryCommand,
} from '@context/lumir-story-context/handlers/commands/update-lumir-story.handler';
import { LumirStoryService } from '@domain/sub/lumir-story/lumir-story.service';
import { LumirStory } from '@domain/sub/lumir-story/lumir-story.entity';

describe('UpdateLumirStoryHandler', () => {
  let handler: UpdateLumirStoryHandler;
  let lumirStoryService: jest.Mocked<LumirStoryService>;

  const mockLumirStoryService = {
    루미르스토리를_업데이트한다: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateLumirStoryHandler,
        {
          provide: LumirStoryService,
          useValue: mockLumirStoryService,
        },
      ],
    }).compile();

    handler = module.get<UpdateLumirStoryHandler>(UpdateLumirStoryHandler);
    lumirStoryService = module.get(LumirStoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('루미르스토리를 업데이트해야 한다', async () => {
      // Given
      const lumirStoryId = 'lumir-story-1';
      const updateDto = {
        title: '수정된 제목',
        content: '수정된 내용',
        updatedBy: 'user-1',
      };

      const command = new UpdateLumirStoryCommand(lumirStoryId, updateDto);

      const mockUpdatedLumirStory = {
        id: lumirStoryId,
        ...updateDto,
        isPublic: true,
        order: 0,
      } as LumirStory;

      mockLumirStoryService.루미르스토리를_업데이트한다.mockResolvedValue(
        mockUpdatedLumirStory,
      );

      // When
      const result = await handler.execute(command);

      // Then
      expect(lumirStoryService.루미르스토리를_업데이트한다).toHaveBeenCalledWith(
        lumirStoryId,
        updateDto,
      );
      expect(result).toEqual(mockUpdatedLumirStory);
    });
  });
});
