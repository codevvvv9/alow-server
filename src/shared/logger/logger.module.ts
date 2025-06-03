import { Module } from "@nestjs/common";
import { AppLoggerService } from "./logger.service";

@Module({
  providers: [AppLoggerService],
  exports: [AppLoggerService],
  imports: [],
})
export class AppLoggerModule {
  // 该模块用于配置应用程序的日志记录功能
  // 可以在这里导入其他模块或提供者来增强日志记录功能
  // 例如，可以导入 Winston 模块或自定义日志服务
}