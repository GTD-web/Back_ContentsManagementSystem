import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVideoGalleryQuery } from '../../queries/get-video-gallery.query';
import { VideoGalleryService } from '@business/video-gallery/video-gallery.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { VideoGalleryDto } from '@domain/sub/video-gallery/video-gallery.types';

@QueryHandler(GetVideoGalleryQuery)
export class GetVideoGalleryHandler
  implements IQueryHandler<GetVideoGalleryQuery>
{
  constructor(private readonly videoService: VideoGalleryService) {}

  async execute(
    query: GetVideoGalleryQuery,
  ): Promise<ApiResponse<VideoGalleryDto>> {
    return this.videoService.비디오_갤러리를_조회_한다(query.videoId);
  }
}
