import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionFilter } from './shared/filters/AllExceptionFillter';

@Module({
  imports: [
    UserModule,
    SharedModule, // 引入共享模块
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局过滤器
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    }
  ],
})
export class AppModule {}
