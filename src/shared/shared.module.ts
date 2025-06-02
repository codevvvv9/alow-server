import { Module } from "@nestjs/common";
import { SystemService } from "./system.service";

@Module({
  imports: [],
  controllers: [],
  providers: [SystemService],
  exports: [SystemService],
})
export class SharedModule {
  // This module can be used to share common services, utilities, or constants across the application.
  // Currently, it does not export any providers or controllers.
}