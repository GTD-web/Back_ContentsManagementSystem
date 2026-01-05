import { Module } from '@nestjs/common';
import { PopupController } from './popup.controller';

@Module({
  controllers: [PopupController],
  providers: [],
})
export class PopupModule {}
