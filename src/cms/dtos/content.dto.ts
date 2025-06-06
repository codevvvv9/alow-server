import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNotEmpty } from "class-validator";
import { ObjectId } from "typeorm";

export class CreateContentDto {
  @ApiProperty({ example: 'ID' })
  id?: number;

  @ApiProperty({ example: '标题' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '{\"title\":\"精通React\"}"' })
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'template' })
  @IsNotEmpty()
  // 内容还是模版
  @IsIn(['template', 'content'])
  type: string;

  // @ApiProperty()
  userId?: ObjectId;

  publish: boolean = false

  @ApiProperty()
  thumbnail?: object

  isDeleted?: boolean
}

export class UpdateContentDto extends PartialType(CreateContentDto) {
}