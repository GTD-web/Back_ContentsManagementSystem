import { Module } from '@nestjs/common';
import { AuthContextModule } from '@context/auth-context';
import { UserWikiController } from './wiki.controller';
import { WikiBusinessModule } from '@business/wiki-business/wiki-business.module';
import { CompanyContextModule } from '@context/company-context/company-context.module';

@Module({
  imports: [
    AuthContextModule,
    WikiBusinessModule,
    CompanyContextModule,
  ],
  controllers: [UserWikiController],
})
export class UserWikiModule {}
