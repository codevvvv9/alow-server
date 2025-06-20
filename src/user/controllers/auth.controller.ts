import {
  Body, 
  Controller, 
  Get, 
  HttpCode, 
  HttpStatus, 
  Post, 
  Req, 
  // Session, 
  UseGuards 
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "../services/auth.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { LoginDTO, RegisterDTO, UserInfoDto } from "../dtos/auth.dto";
import { BaseApiErrorResponse, SwaggerBaseApiResponse } from "src/shared/dtos/base-api-response.dto";

@ApiTags('auth 认证鉴权')
@Controller('api')
export class AuthController {
  constructor(
    // Controller装饰器继承了Injectable() 装饰器，所以可以直接注入服务
    private readonly authService: AuthService,
  ) {
    
  }

  @ApiOperation({
    summary: '用户注册',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(LoginDTO),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @HttpCode(200) // 设置HTTP状态码为200
  @Post('register')
  async register(
    // 这里可以使用具体的 DTO 类型代替 Record<string, any>
    @Body() registerDTO: RegisterDTO 
  ): Promise<any> {
    // 处理注册逻辑
    return this.authService.registerByName(registerDTO);
  }

  @ApiOperation({
    summary: '用户登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(LoginDTO),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @HttpCode(200) // 设置HTTP状态码为200
  @Post('login')
  async login(
    @Body() loginDTO: LoginDTO,
  ): Promise<any> {
    // 处理登录逻辑
    const userLogin = await this.authService.login(loginDTO);
    return userLogin
  }

  @ApiOperation({
    summary: '用户登出',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '登出成功',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: BaseApiErrorResponse,
  })
  @HttpCode(200) // 设置HTTP状态码为200
  @Post('logout')
  async logout(): Promise<any> {
    // 处理登出逻辑
    // return this.authService.logout();
    return {
      msg: '登出成功'
    }
  }

  @ApiOperation({
    summary: '获取用户信息',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(UserInfoDto),
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    // type: BaseApiErrorResponse,
  })
  @ApiBearerAuth() // 添加Bearer认证
  @Get('info')
  // 使用自定义的JWT守卫保护此路由
  @UseGuards(JwtAuthGuard) 
  async getInfo(
    @Req() req: any // 这里可以使用具体的 Request 类型
  ): Promise<any> {
    // 获取用户信息逻辑
    const data = await this.authService.getInfo(req.user.id);
    return {
      data
    }
  }
}