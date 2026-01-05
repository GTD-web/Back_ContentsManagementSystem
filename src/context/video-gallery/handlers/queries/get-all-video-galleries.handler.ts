import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllVideoGalleriesQuery } from '../../queries/get-all-video-galleries.query';
import { VideoGalleryService } from '@business/video-gallery/video-gallery.service';
import type { ApiResponse } from '@domain/common/types/api-response.types';
import type { VideoGalleryDto } from '@domain/sub/video-gallery/video-gallery.types';

@QueryHandler(GetAllVideoGalleriesQuery)
export class GetAllVideoGalleriesHandler
  implements IQueryHandler<GetAllVideoGalleriesQuery>
{
  constructor(private readonly videoService: VideoGalleryService) {}

  async execute(
    query: GetAllVideoGalleriesQuery,
  ): Promise<ApiResponse<VideoGalleryDto[]>> {
    return this.videoService.비디오_갤러리_목록을_조회_한다(query.code);
  }
}
