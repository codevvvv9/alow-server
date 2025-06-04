import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { SharedModule } from '../shared/shared.module';
import { UserProviders } from './user.providers';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [
    UserController,
    AuthController,
  ],
  providers: [
    UserService,
    ...UserProviders,
    AuthService,
    JwtStrategy
  ],
  imports: [
    SharedModule,
    JwtModule.registerAsync({
      // 哪些服务需要注入，配置服务需要拉配置，注入到 useFactory中
      inject: [ConfigService],
      // 哪些模块被导入到当前模块中，jwtModule 需要用到 sharedModule中的配置
      imports: [SharedModule],
      // 配置来源src/shared/configs/configuration.ts
      useFactory: async (configService: ConfigService) => (configService.get('jwt'))
    }),
  ],
})
export class UserModule {}
