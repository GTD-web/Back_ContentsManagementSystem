import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoGallery } from '@domain/sub/video-gallery/video-gallery.entity';
import { VideoGalleryService } from './video-gallery.service';

/**
 * 비디오 갤러리 비즈니스 모듈
 *
 * @description
 * - 비디오 갤러리 관련 비즈니스 서비스를 제공합니다.
 */
@Module({
  imports: [TypeOrmModule.forFeature([VideoGallery])],
  providers: [VideoGalleryService],
  exports: [VideoGalleryService],
})
export class VideoGalleryBusinessModule {}
