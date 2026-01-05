import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsBusinessModule } from '@business/news';

@Module({
  imports: [NewsBusinessModule],
  controllers: [NewsController],
})
export class NewsInterfaceModule {}
