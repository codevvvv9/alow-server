import { Module } from '@nestjs/common';
import { ContentService } from './services/content.service';
import { ContentController } from './controllers/content.controller';
import { CMSProviders } from './cms.providers';
import { SharedModule } from '@/shared/shared.module';
import { TemplateController } from './controllers/template.controller';

@Module({
  controllers: [
    ContentController,
    TemplateController,
  ],
  providers: [
    ContentService,
    ...CMSProviders,
  ],
  imports: [
    SharedModule
  ],
  exports: [
  ]
})
export class CmsModule {}
