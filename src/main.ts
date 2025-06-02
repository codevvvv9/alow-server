import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { generateDocument } from './doc';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 添加全局管道，做校验
  app.useGlobalPipes(new ValidationPipe())
  // 生成swagger 文档 /api/doc
  // 访问地址 http://localhost:3000/api/doc
  generateDocument(app);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
