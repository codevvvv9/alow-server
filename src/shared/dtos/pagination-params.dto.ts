import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

export class PaginationParamsDto {
  @ApiPropertyOptional({
    description: 'page: 当前页码,从1开始',
    example: 1,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
// { toClassOnly: true } 是 class-transformer 中 @Transform 装饰器的选项，用于指定转换行为仅在将普通对象转换为类实例时生效。
// 作用
// toClassOnly: true 表示这个转换规则只在 普通对象转换为类实例 的过程中应用。
// 它不会影响类实例转换为普通对象的过程（例如序列化为 JSON）。
  @Transform(({ value }) => parseInt(value, 10) || 1, { toClassOnly: true })
  page = 1;

  @ApiPropertyOptional({
    description: 'pageSize: 每页条数',
    example: 5,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10) || 5, { toClassOnly: true })
  pageSize = 5;
}