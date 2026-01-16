import { Test, TestingModule } from '@nestjs/testing';
import {
  DeleteLumirStoryHandler,
  DeleteLumirStoryCommand,
} from '@context/lumir-story-context/handlers/commands/delete-lumir-story.handler';
import { LumirStoryService } from '@domain/sub/lumir-story/lumir-story.service';

describe('DeleteLumirStoryHandler', () => {
  let handler: DeleteLumirStoryHandler;
  let lumirStoryService: jest.Mocked<LumirStoryService>;

  const mockLumirStoryService = {
    루미르스토리를_삭제한다: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteLumirStoryHandler,
        {
          provide: LumirStoryService,
          useValue: mockLumirStoryService,
        },
      ],
    }).compile();

    handler = module.get<DeleteLumirStoryHandler>(DeleteLumirStoryHandler);
    lumirStoryService = module.get(LumirStoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('루미르스토리를 삭제해야 한다', async () => {
      // Given
      const command = new DeleteLumirStoryCommand('lumir-story-1');

      mockLumirStoryService.루미르스토리를_삭제한다.mockResolvedValue(true);

      // When
      const result = await handler.execute(command);

      // Then
      expect(lumirStoryService.루미르스토리를_삭제한다).toHaveBeenCalledWith(
        'lumir-story-1',
      );
      expect(result).toBe(true);
    });
  });
});
