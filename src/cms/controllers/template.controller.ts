import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  HttpCode,
  Req,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ContentService } from '../services/content.service';
import { CreateContentDto } from '../dtos/content.dto';
import { UpdateCmDto } from '../dtos/update-cm.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseApiErrorResponse, SwaggerBaseApiResponse } from 'src/shared/dtos/base-api-response.dto';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { ObjectId } from 'typeorm';
import { log } from 'console';
import { plainToInstance } from 'class-transformer';
import { PaginationParamsDto } from '@/shared/dtos/pagination-params.dto';
import { query } from 'winston';
import { IdDTO } from '@/shared/dtos/id.dto';

@ApiTags('模版管理')
@Controller('api/web/template')
export class TemplateController {
  constructor(private readonly contentService: ContentService) {}

  @ApiOperation({ 
    summary: '新建/更新模版' 
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateContentDto),
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    type: BaseApiErrorResponse 
  })
  // 使用自定义的JWT守卫保护此路由
  @UseGuards(JwtAuthGuard)
  @Post('save')
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() dto: CreateContentDto,
    // 因为新建/更新都放一起了，所以需要 req 的参数
    @Req() req: Record<string, any>
  ) {
    // 这是因为 JWT 认证守卫 (JwtAuthGuard) 
    // 在验证 token 时，会将解析出的用户信息附加到 request 对象上。
    const userId = req.user.id;
    dto.userId = userId;
    const content = await this.contentService.create(dto);
    return content
  }

  @ApiOperation({ 
    summary: '获取所有模版' 
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateContentDto),
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    type: BaseApiErrorResponse 
  })
  @Get('list')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: PaginationParamsDto,
    @Req() req: Record<string, any>
  ) {
    const userId = req.user.id;
    console.log('userId === ', userId);
    // 将查询参数转换为 PaginationParamsDto 实例
    // 确保 class-transformer 能够正确转换
    const paginationParams = plainToInstance(PaginationParamsDto, query)
    const { data, count}  = await this.contentService.findAll({
      ...paginationParams,
      userId
    }
    );
    return {
      data,
      meta: {
        total: count, // 总记录数
        page: paginationParams.page, // 当前页码
        pageSize: paginationParams.pageSize, // 每页条数
      }
    }
  }

  @ApiOperation({
    summary: '获取单个模版'
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('get')
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateContentDto),
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    type: BaseApiErrorResponse 
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Query() query: Record<string, any>) {
    const { id } = query
    return await this.contentService.findOne(id);
  }

  @ApiOperation({
    summary: '查找已发布模版列表'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateContentDto),
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    type: BaseApiErrorResponse 
  })
  @UseGuards(JwtAuthGuard)
  @Get('publishList')
  @HttpCode(HttpStatus.OK)
  async findPublishList(
    // 分页信息
    @Query() query: PaginationParamsDto,
    @Req() req: Record<string, any> // 登录信息，用到 userId
  ) {
    const userId = req.user.id;
    const paginationParams = plainToInstance(PaginationParamsDto, query)
    const { data, count}  = await this.contentService.findPublishList({
      ...paginationParams,
      userId
    }
    );
    return {
      data,
      meta: {
        total: count, // 总记录数
        page: paginationParams.page, // 当前页码
        pageSize: paginationParams.pageSize, // 每页条数
      }
    }
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCmDto: UpdateCmDto) {
    return this.contentService.update(+id, updateCmDto);
  }

  @ApiOperation({
    summary: '删除某条模板'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateContentDto),
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    type: BaseApiErrorResponse 
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async remove(@Body() dto: IdDTO) {
    const { id } = dto
    return await this.contentService.remove(+id);
  }

  @ApiOperation({
    summary: '发布某条模板'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateContentDto),
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    type: BaseApiErrorResponse 
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('publish')
  @ApiBearerAuth()
  async publishContent(@Body() dto: IdDTO) {
    const { id } = dto
    // 其实是逻辑发布而已
    return this.contentService.create({
      id,
      publish: true
    })
  }

  @ApiOperation({
    summary: '下架某条模版'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateContentDto),
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    type: BaseApiErrorResponse 
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('unpublish')
  @ApiBearerAuth()
  async unpublishContent(@Body() dto: IdDTO) {
    const { id } = dto
    return this.contentService.create({
      id,
      publish: false
    })
  }

  @ApiOperation({
    summary: '生成截图'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: SwaggerBaseApiResponse(CreateContentDto),
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    type: BaseApiErrorResponse 
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('screenshot/:id')
  @ApiBearerAuth()
  async takeScreenshot(@Param('id') id: string) {
    if (!id) {
      throw new BadRequestException('生成截图时, id 不能为空')
    }
    return this.contentService.takeScreenshot(+id)
  }
}
