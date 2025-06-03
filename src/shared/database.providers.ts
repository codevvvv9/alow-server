import { ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { join } from "node:path";

const databaseType: DataSourceOptions['type'] = 'mongodb'; // 数据库类型
// 数据库的连接提供者
export const DatabaseProviders = [
  // 会有多个数据库连接提供者
  {
    provide: 'MONGODB_DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const config: DataSourceOptions = {
        type: databaseType,
        url: configService.get<string>('database.url'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        database: configService.get<string>('database.name'),
        // synchronize: true, // 开发环境下可以开启，生产环境下建议关闭
        logging: configService.get<boolean>('database.logging'), // 开发环境下可以开启，生产环境下建议关闭
        entities: [join(__dirname, '../../**/*.mongo.entity{.ts,.js}')], // 实体文件路径
      }

      const dataSource = new DataSource(config)
      await dataSource.initialize()
      return dataSource;
    }
  }
]