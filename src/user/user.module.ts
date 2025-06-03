import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SharedModule } from '../shared/shared.module';
import { UserProviders } from './user.providers';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    ...UserProviders,
  ],
  imports: [
    SharedModule
  ],
})
export class UserModule {}
