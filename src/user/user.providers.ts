// mongo 3.6版本的用法
// import { User } from "./entities/user.mongo.entity";

// export const UserProviders = [
//   // 在这里可以添加用户相关的提供者
//   // 例如：用户模型、用户仓库等
//   {
//     provide: 'USER_REPOSITORY',
//     useFactory: async (AppDataSource) => {
//       await AppDataSource.getRepository(User)
//     },
//     inject: ['MONGODB_DATA_SOURCE'],
//   }
// ]

// mongo 6.x版本的用法
import { DataSource } from 'typeorm';
import { User } from './entities/user.mongo.entity';

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => {
      return dataSource.getMongoRepository(User); // 返回 MongoRepository<User>
    },
    inject: ['MONGODB_DATA_SOURCE'], // 确保注入正确的数据库连接
  },
];