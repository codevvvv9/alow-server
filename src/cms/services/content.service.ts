import { Inject, Injectable } from '@nestjs/common';
import { CreateContentDto } from '../dtos/content.dto';
import { UpdateContentDto } from '../dtos/content.dto';
import { DeepPartial, MongoRepository } from 'typeorm';
import { Content } from '../entities/content.mongo.entity';
import { AppLoggerService } from '@/shared/logger/logger.service';
import { PaginationParamsDto } from '@/shared/dtos/pagination-params.dto';

@Injectable()
export class ContentService {
  constructor(
    // 属性注入数据库操作的仓库服务
    @Inject('CONTENT_REPOSITORY') 
    private contentRepository: MongoRepository<Content>,
    private readonly logger: AppLoggerService
  ) {
    this.logger.setContext(ContentService.name);
  }
  async create(createCmDto: UpdateContentDto) {
    
    // 获取 id，看看数据库有没有这个用户，来确定是更新还是新建
    const { id } = createCmDto
    this.logger.info('createCmDto === ', JSON.stringify(createCmDto))
    const existingContent = await this.contentRepository.findOne({
      where: {
        id: Number(id) // 将 id 转换为数字
      }
    })
    console.log('existingContent === ', existingContent);
    
    let result = null
    if (existingContent) {
      // 更新
      // const updateData: DeepPartial<Content> = {
      //   ...createCmDto,
      //   thumbnail: createCmDto.thumbnail?.toString() || '',
      // };
      const updateContent = this.contentRepository.create({
        ...createCmDto,
        thumbnail: createCmDto.thumbnail?.toString() || '',
      })
      result = await this.contentRepository.update(
        { id: Number(id) }, // 将 id 转换为数字 
        updateContent
      );
    } else {
      // 新建
      const count = await this.contentRepository.count()
      createCmDto.id = count + 1
      createCmDto.publish = false
      createCmDto.isDeleted = false
      // const contentEntity: DeepPartial<Content> = {
      //   ...createCmDto,
      //   thumbnail: createCmDto.thumbnail?.toString() || '',
      // };
      //! 用这个方式去创建
      const newContent = this.contentRepository.create({
        ...createCmDto,
        thumbnail: createCmDto.thumbnail?.toString() || '',
      })
      this.logger.info('save newContent === ', JSON.stringify(newContent))
      result = await this.contentRepository.save(newContent);
    } 

    // 同步 SSR
    await this.syncSSR(id)
    const thumbnail = await this.takeScreenshot(id)
    createCmDto.thumbnail = thumbnail
    return createCmDto
  }

  async syncSSR(id: number) {
    //TODO
  }

  async takeScreenshot(id: number){
    // TODO
    return {

    }
  }
  async findAll(paginationParams: {
    page: number;
    pageSize: number;
    userId?: string
  }): Promise<{data: Content[], count: number}> {
    const { page, pageSize,userId } = paginationParams
    this.logger.info('paginationParams === ', JSON.stringify(paginationParams))
    const [data, count]  = await this.contentRepository.findAndCount({
      where: {
        userId,
        isDeleted: false
      },
      skip: (page - 1) * pageSize, // 计算跳过的记录数
      take: pageSize, // 限制返回的记录数
      cache: true, // 启用缓存
      order: {
        createdAt: 'DESC', // 按照创建时间降序排列
      },
    })
    return {
      data,
      count,
    }
  }

  async findOne(id: string) {
    const content = await this.contentRepository.findOneBy({
      id: parseInt(id),
      isDeleted: false
    })
    return content
  }

  async findPublishList(paginationParams: {
    page: number;
    pageSize: number;
    userId?: string
  }): Promise<{data: Content[], count: number}> {
    const { page, pageSize } = paginationParams
    const [data, count]  = await this.contentRepository.findAndCount({
      where: {
        publish: true,
        isDeleted: false
      },
      skip: (page - 1) * pageSize, // 计算跳过的记录数
      take: pageSize, // 限制返回的记录数
      cache: true, // 启用缓存
      order: {
        createdAt: 'DESC', // 按照创建时间降序排列
      },
    })
    return {
      data,
      count,
    }
  }
  update(id: number, updateCmDto: UpdateContentDto) {
    return `This action updates a #${id} cm`;
  }

  async remove(id: number) {
    // 逻辑删除
    const result = await this.contentRepository.updateOne(
      { id },
      { $set: { 
          isDeleted: true,
          publish: false
        } 
      }
    )
    // 同步 SSR
    await this.syncSSR(id)
    return result
  }

  /**
   * 发布某条内容，使用 create 代替了
   * @deprecated 
   * @param id 内容 id
   * @returns 
   */
  async publishContent(id: number) {
    const result = await this.contentRepository.updateOne(
      { id },
      { $set: { 
          publish: true
        } 
      }
    )
    // 同步 SSR
    await this.syncSSR(id)
    return result
  }
}
