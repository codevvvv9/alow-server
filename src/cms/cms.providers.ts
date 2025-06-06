import { DataSource } from 'typeorm';
import { Content } from './entities/content.mongo.entity';

export const CMSProviders = [
  {
    provide: 'CONTENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
      return dataSource.getMongoRepository(Content); // 返回 MongoRepository<User>
    },
    inject: ['MONGODB_DATA_SOURCE'], // 确保注入正确的数据库连接
  },
];