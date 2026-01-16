import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateLumirStoryHandler,
  CreateLumirStoryCommand,
} from '@context/lumir-story-context/handlers/commands/create-lumir-story.handler';
import { LumirStoryService } from '@domain/sub/lumir-story/lumir-story.service';
import { LumirStory } from '@domain/sub/lumir-story/lumir-story.entity';

describe('CreateLumirStoryHandler', () => {
  let handler: CreateLumirStoryHandler;
  let lumirStoryService: jest.Mocked<LumirStoryService>;

  const mockLumirStoryService = {
    루미르스토리를_생성한다: jest.fn(),
    다음_순서를_계산한다: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateLumirStoryHandler,
        {
          provide: LumirStoryService,
          useValue: mockLumirStoryService,
        },
      ],
    }).compile();

    handler = module.get<CreateLumirStoryHandler>(CreateLumirStoryHandler);
    lumirStoryService = module.get(LumirStoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('루미르스토리를 생성해야 한다', async () => {
      // Given
      const command = new CreateLumirStoryCommand({
        title: '루미르 스토리 제목',
        content: '루미르 스토리 내용',
        createdBy: 'user-1',
      });

      const mockLumirStory = {
        id: 'lumir-story-1',
        title: command.data.title,
        content: command.data.content,
        isPublic: true,
        order: 0,
        imageUrl: null,
        attachments: null,
        createdAt: new Date(),
      } as any as LumirStory;

      mockLumirStoryService.다음_순서를_계산한다.mockResolvedValue(0);
      mockLumirStoryService.루미르스토리를_생성한다.mockResolvedValue(
        mockLumirStory,
      );

      // When
      const result = await handler.execute(command);

      // Then
      expect(lumirStoryService.다음_순서를_계산한다).toHaveBeenCalled();
      expect(lumirStoryService.루미르스토리를_생성한다).toHaveBeenCalledWith(
        expect.objectContaining({
          title: command.data.title,
          content: command.data.content,
          isPublic: true,
          order: 0,
          createdBy: 'user-1',
        }),
      );
      expect(result).toMatchObject({
        id: 'lumir-story-1',
        isPublic: true,
        order: 0,
      });
    });

    it('첨부파일이 있는 루미르스토리를 생성해야 한다', async () => {
      // Given
      const command = new CreateLumirStoryCommand({
        title: '루미르 스토리 제목',
        content: '루미르 스토리 내용',
        attachments: [
          {
            fileName: 'story.pdf',
            fileUrl: 'https://s3.aws.com/story.pdf',
            fileSize: 1024000,
            mimeType: 'application/pdf',
          },
        ],
        createdBy: 'user-1',
      });

      const mockLumirStory = {
        id: 'lumir-story-1',
        title: command.data.title,
        content: command.data.content,
        isPublic: true,
        order: 0,
        attachments: command.data.attachments,
        createdAt: new Date(),
      } as any as LumirStory;

      mockLumirStoryService.다음_순서를_계산한다.mockResolvedValue(0);
      mockLumirStoryService.루미르스토리를_생성한다.mockResolvedValue(
        mockLumirStory,
      );

      // When
      const result = await handler.execute(command);

      // Then
      expect(lumirStoryService.루미르스토리를_생성한다).toHaveBeenCalledWith(
        expect.objectContaining({
          attachments: command.data.attachments,
        }),
      );
      expect(result.id).toBe('lumir-story-1');
    });

    it('이미지 URL이 있는 루미르스토리를 생성해야 한다', async () => {
      // Given
      const command = new CreateLumirStoryCommand({
        title: '루미르 스토리 제목',
        content: '루미르 스토리 내용',
        imageUrl: 'https://s3.aws.com/image.jpg',
        createdBy: 'user-1',
      });

      const mockLumirStory = {
        id: 'lumir-story-1',
        title: command.data.title,
        content: command.data.content,
        imageUrl: command.data.imageUrl,
        isPublic: true,
        order: 0,
        createdAt: new Date(),
      } as any as LumirStory;

      mockLumirStoryService.다음_순서를_계산한다.mockResolvedValue(0);
      mockLumirStoryService.루미르스토리를_생성한다.mockResolvedValue(
        mockLumirStory,
      );

      // When
      const result = await handler.execute(command);

      // Then
      expect(lumirStoryService.루미르스토리를_생성한다).toHaveBeenCalledWith(
        expect.objectContaining({
          imageUrl: 'https://s3.aws.com/image.jpg',
        }),
      );
      expect(result.id).toBe('lumir-story-1');
    });

    it('order를 자동으로 계산해야 한다', async () => {
      // Given
      const command = new CreateLumirStoryCommand({
        title: '루미르 스토리 제목',
        content: '루미르 스토리 내용',
        createdBy: 'user-1',
      });

      const mockLumirStory = {
        id: 'lumir-story-1',
        isPublic: true,
        order: 5, // 계산된 order
        createdAt: new Date(),
      } as any as LumirStory;

      mockLumirStoryService.다음_순서를_계산한다.mockResolvedValue(5);
      mockLumirStoryService.루미르스토리를_생성한다.mockResolvedValue(
        mockLumirStory,
      );

      // When
      const result = await handler.execute(command);

      // Then
      expect(lumirStoryService.다음_순서를_계산한다).toHaveBeenCalled();
      expect(lumirStoryService.루미르스토리를_생성한다).toHaveBeenCalledWith(
        expect.objectContaining({
          order: 5,
        }),
      );
      expect(result.order).toBe(5);
    });
  });
});
