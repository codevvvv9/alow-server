import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class BaseApiResponse<T> {
  public data: T

  @ApiProperty({ type: Object })
  public meta: any
}

// 返回的是 BaseApiResponse 类本身，而不是 BaseApiResponse 的实例。
// 换句话说，返回值是 BaseApiResponse 的构造函数，可以用来创建 BaseApiResponse 的实例。
// 例如，如果你有一个类 BaseApiResponse<T> { ... }，那么 typeof BaseApiResponse 就是指这个类本身，而不是这个类的实例。
// 在这个函数中，返回 typeof BaseApiResponse 的目的是为了返回一个可以用来创建 BaseApiResponse 实例的类型，而不是直接返回一个实例。
export function SwaggerBaseApiResponse<T>(type: T): typeof BaseApiResponse {
  class ExtendedBaseApiResponse<T> extends BaseApiResponse<T> {
    @ApiProperty({ type: () => type })
    public data: T;
  }

  const isAnArray = Array.isArray(type) ? '[]' : ''
  Object.defineProperty(ExtendedBaseApiResponse, 'name', {
    value: `SwaggerBaseApiResponseFor ${type} ${isAnArray}` 
  })
  return ExtendedBaseApiResponse
}

export class BaseApiErrorObject {
  @ApiProperty({ type: Number })
  public statusCode: number;

  @ApiProperty({ type: String })
  public message: string;

  @ApiPropertyOptional({ type: String })
  public localizedMessage: string;

  @ApiProperty({ type: String })
  public errorName: string;

  @ApiProperty({ type: Object })
  public details: unknown;

  @ApiProperty({ type: String })
  public path: string;

  @ApiProperty({ type: String })
  public requestId: string;

  @ApiProperty({ type: String })
  public timestamp: string;
}

export class BaseApiErrorResponse {
  @ApiProperty({ type: BaseApiErrorObject })
  public error: BaseApiErrorObject;
}