import { Module } from "@nestjs/common";
import { SystemService } from "./system.service";
import { ConfigModule } from "@nestjs/config";
import { configModuleOptions } from "./configs/module-options";

@Module({
  imports: [
    // 注入 config
    ConfigModule.forRoot(configModuleOptions),
  ],
  controllers: [],
  providers: [SystemService],
  exports: [
    SystemService,
    ConfigModule, // Exporting ConfigModule to make it available in other modules
  ],
})
export class SharedModule {
  // This module can be used to share common services, utilities, or constants across the application.
  // Currently, it does not export any providers or controllers.
}