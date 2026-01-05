import { Module } from '@nestjs/common';
import { VideoGalleryController } from './video-gallery.controller';

@Module({
  controllers: [VideoGalleryController],
  providers: [],
})
export class VideoGalleryModule {}
