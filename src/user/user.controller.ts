import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { PaginationParamsDto } from 'src/shared/dtos/pagination-params.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('用户相关') // Swagger 标签，用于分组API
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    // 如果需要注入其他服务，可以在这里添加
    private readonly configService: ConfigService
  ) {}

  @ApiOperation({
    summary: '创建用户',
    description: '创建一个新的用户',
    // tags: ['User Management'],
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '用户创建成功',
    type: CreateUserDto, // 返回的类型
  })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // console.log('ENV: URL === ', this.configService.get<string>('database.url'));
    
    return this.userService.create(createUserDto);
  }

  @Get()
  async findAll(@Query() query: Record<string, any>) {
    // 如果需要处理分页参数，可以在这里进行处理
    console.log('Query Params:', query);
    // 将查询参数转换为 PaginationParamsDto 实例
    // 确保 class-transformer 能够正确转换
    const paginationParams = plainToInstance(PaginationParamsDto, query)
    // return this.userService.findAll(paginationParams);
    const { data, count}  = await this.userService.findAll(paginationParams);
    return {
      data,
      meta: {
        total: count, // 总记录数
        page: paginationParams.page, // 当前页码
        pageSize: paginationParams.pageSize, // 每页条数
      }
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
