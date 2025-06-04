import { ArgumentsHost, ExceptionFilter, HttpStatus, Injectable } from "@nestjs/common";
import { AppLoggerService } from "../logger/logger.service";

@Injectable()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: AppLoggerService, // 日志服务
  ) {
    this.logger.setContext(AllExceptionFilter.name); // 设置日志上下文
  }
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 获取当前的HTTP上下文
    const response = ctx.getResponse(); // 获取响应对象
    // 获取异常状态码，如果没有则默认为500
    const status = exception.getStatus ? exception.getStatus() : 500;

    // 构建错误响应
    const msg = exception.message || 'Internal server error';
    this.logger.error('exception filter', `Exception caught: ${msg}`)
    // 返回的都是 200，真正的信息包在 json 中
    response.status(HttpStatus.OK).json({
      code: status,
      msg,
    });
  }
}