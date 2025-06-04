imp:rt { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { AppLoggerService } from "../logger/logger.service";

@Injectable()
export class RemoveSensitiveInfoInterceptor implements NestInterceptor {
  constructor(
    // 可以在这里注入其他服务，如果需要的话
    // private readonly systemService: SystemService, // 例如，注入系统服务
    // private readonly configService: ConfigService, // 如果需要配置服务
    private readonly logger: AppLoggerService, // 日志服务
  ) {

  }
  sensitiveKeys = ['password', 'salt']; // 默认敏感字段

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map(res => {
        if (res && typeof res === 'object') {
          this.logger.info('remove sensitive ctx', `Response before removing sensitive info: ${JSON.stringify(res)}`);
          res = JSON.parse(JSON.stringify(res));
          // 全局消除，如果有敏感信息，删除密码等字段
          res = this.removeSensitiveInfo(res, this.sensitiveKeys);
        }
        return {
          code: 200,
          result: res,
        }
      })
    )
  }

  /**
   * 移除敏感信息
   * @param data 要处理的对象
   * @param targetKeys 要移除的敏感字段数组
   * @param visited 使用过的WeakSet，防止循环引用
   * @returns 被移除敏感信息后的对象
   */
  private removeSensitiveInfo(
    data, 
    targetKeys: string[] = this.sensitiveKeys,
    visited: WeakSet<any> = new WeakSet()
  ): any {
    if (!data || typeof data !== 'object' || data instanceof Date || data instanceof RegExp || Buffer.isBuffer(data)) {
      // data是null、undefined、Date、RegExp、Buffer等类型，直接返回
      return data;  
    }
    // 防止循环引用
    if (visited.has(data)) {
      return data; // 如果已经访问过，直接返回
    }
    visited.add(data); // 标记为已访问
    if (Array.isArray(data)) {
      return data.length ? data.map(item => this.removeSensitiveInfo(item, targetKeys)) : []; // 如果是数组，递归处理每个元素
    }
    if(Object.keys(data).length === 0) {
      return data; // 如果是空对象，直接返回
    }
    const result = { ...data };
    // data是对象，可能值又是对象，要递归调用
    for (const key in result) {
      if(targetKeys.includes(key)) {
        delete result[key];
      } else if(typeof result[key] === 'object') {
        result[key] = this.removeSensitiveInfo(result[key], targetKeys);
      }
     
    }
    return result;
  }
}