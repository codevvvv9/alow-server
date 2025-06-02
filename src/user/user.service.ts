import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SystemService } from '../shared/system.service'; // Adjust the path as needed

@Injectable()
export class UserService {
  constructor(
    // You can inject other services here if needed, e.g., SystemService from SharedModule
    private readonly systemService: SystemService,
  ) {}
  create(createUserDto: CreateUserDto) {
    // 追加调用模块
    // console.log('env === ', this.systemService.getEnv())
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
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
