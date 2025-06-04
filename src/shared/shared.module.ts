import { Module } from "@nestjs/common";
import { SystemService } from "./system.service";
import { ConfigModule } from "@nestjs/config";
import { configModuleOptions } from "./configs/module-options";
import { DatabaseProviders } from "./database.providers";
import { AppLoggerModule } from "./logger/logger.module";
import { RemoveSensitiveInfoInterceptor } from "./interceptors/remove-sensitive-info.interceptor";
import { AllExceptionFilter } from "./filters/AllExceptionFillter";

@Module({
  imports: [
    // 注入 config
    ConfigModule.forRoot(configModuleOptions),
    AppLoggerModule
  ],
  controllers: [],
  providers: [
    SystemService,
    ...DatabaseProviders,
    RemoveSensitiveInfoInterceptor,
    AllExceptionFilter
  ],
  exports: [
    SystemService,
    ConfigModule, // Exporting ConfigModule to make it available in other modules
    ...DatabaseProviders, // Exporting database providers to make them available in other modules
    AppLoggerModule,
    RemoveSensitiveInfoInterceptor, // Exporting the interceptor to make it available in other modules
    AllExceptionFilter
  ],
})
export class SharedModule {
  // This module can be used to share common services, utilities, or constants across the application.
  // Currently, it does not export any providers or controllers.
}