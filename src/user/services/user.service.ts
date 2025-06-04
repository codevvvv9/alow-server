import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { SystemService } from '../../shared/system.service'; // Adjust the path as needed
import { MongoRepository } from 'typeorm';
import { User } from '../entities/user.mongo.entity';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { AppLoggerService } from 'src/shared/logger/logger.service';

@Injectable()
export class UserService {
  constructor(
    // You can inject other services here if needed, e.g., SystemService from SharedModule
    private readonly systemService: SystemService,
    @Inject('USER_REPOSITORY') private userRepository: MongoRepository<User>, 
    private readonly logger: AppLoggerService
  ) {
    // 可以在这里进行一些初始化操作
    this.logger.setContext(UserService.name); // 设置日志上下文
    // this.logger.info('UserService initialized', UserService.name); // 日志记录初始化信息
  }

  // create(createUserDto: CreateUserDto) {
  //   // 追加调用模块
  //   // console.log('env === ', this.systemService.getEnv())
  //   return 'This action adds a new user';
  // }
  // 使用 mongo 的 orm 操作
  async create(user) {
    return this.userRepository.save(user);
  }
  async findAll({pageSize, page}: PaginationParamsDto): Promise<{data: User[], count: number}> {
    // return `This action returns all user`;
    // throw new HttpException('自定义异常', HttpStatus.CONFLICT)
    const [data, count] = await this.userRepository.findAndCount({
      skip: (page - 1) * pageSize, // 计算跳过的记录数
      take: pageSize, // 限制返回的记录数
      order: {
        createdAt: 'DESC', // 按照创建时间降序排列
      },
      cache: true, // 启用缓存
      // 这里可以添加其他查询条件
    });
    return {
      data,
      count,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
