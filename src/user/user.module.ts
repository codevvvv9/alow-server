import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { SharedModule } from '../shared/shared.module';
import { UserProviders } from './user.providers';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [
    UserController,
    AuthController,
  ],
  providers: [
    UserService,
    ...UserProviders,
    AuthService,
  ],
  imports: [
    SharedModule
  ],
})
export class UserModule {}
