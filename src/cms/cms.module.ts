import { Module } from '@nestjs/common';
import { ContentService } from './services/content.service';
import { ContentController } from './controllers/content.controller';
import { CMSProviders } from './cms.providers';
import { SharedModule } from '@/shared/shared.module';

@Module({
  controllers: [ContentController],
  providers: [
    ContentService,
    ...CMSProviders,
  ],
  imports: [
    SharedModule
  ],
})
export class CmsModule {}
