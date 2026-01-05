import { Module } from '@nestjs/common';
import { VideoGalleryController } from './video-gallery.controller';
import { VideoGalleryBusinessModule } from '@business/video-gallery';

@Module({
  imports: [VideoGalleryBusinessModule],
  controllers: [VideoGalleryController],
})
export class VideoGalleryModule {}
