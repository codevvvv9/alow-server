import { BadRequestException, Inject, Injectable } from "@nestjs/common";
// import { JwtService } from "@nestjs/jwt";
import { MongoRepository } from "typeorm";
import { User } from "../entities/user.mongo.entity";
import { AppLoggerService } from "src/shared/logger/logger.service";
import { RegisterDTO } from "../dtos/auth.dto";
import { encryptPassword, generateSalt } from "src/shared/utils/cryptogram.utils";

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: MongoRepository<User>, // 假设有一个用户仓库用于用户数据操作
    private readonly logger: AppLoggerService // 注入日志服务
  ) {

  }
  async registerByName(registerDTO: RegisterDTO): Promise<User> {
    // 这里可以添加用户注册逻辑，比如保存用户到数据库
    this.logger.info('Registering user', registerDTO.name);
    // 校验注册表单
    await this.checkRegisterForm(registerDTO);
    // 提取注册的用户名密码开始比对
    const { name, password } = registerDTO;
    const { salt, passwordHash } = this.getPasswordHashAndSalt(password);
    // 创建新用户实例
    const newUser = this.userRepository.create({
      name,
      password: passwordHash, // 注意：实际应用中密码应该加密存储
      salt, // 如果需要盐值加密，可以在这里处理
    });
    // 保存新用户到数据库
    const savedUser = await this.userRepository.save(newUser);
    this.logger.info('User registered successfully', JSON.stringify(savedUser));
    return savedUser; // 返回保存的用户信息
  }

  private getPasswordHashAndSalt(password: string): { passwordHash: string; salt: string } {
    const salt = generateSalt();
    const passwordHash = encryptPassword(password, salt);
    return {
      passwordHash,
      salt,
    };
  }

  async checkRegisterForm(registerDTO: RegisterDTO): Promise<any> {
    const { name } = registerDTO;
    const hasUser = await this.userRepository.findOneBy({
      name, 
    });
    if (hasUser) { 
      this.logger.warn('check register', `User with name ${name} already exists`);
      // return {
      //   code: 1,
      //   msg: '用户已存在',
      // };
      throw new BadRequestException(`用户${name} 已存在`);
    }
    this.logger.info('check register', `User with name ${name} does not exist, proceeding with registration`);
  }
}