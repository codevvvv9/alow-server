import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength, Matches } from "class-validator";
export class CreateUserDto {

  @ApiProperty({
    description: '用户手机号',
    example: '13800138000',
    type: String,
    required: true,
    pattern: '^1[3-9]\\d{9}$', // 手机号正则表达式
    maxLength: 11,
    minLength: 11,
    uniqueItems: true, // 确保手机号唯一
    nullable: false,
    default: '13800138000',
    format: 'phone-number', // 自定义格式
    title: 'Phone Number',
  })
  @Matches(/^1[3-9]\d{9}$/, {
    message: '手机号格式不正确，必须是11位数字，以1开头，第二位为3-9之间的数字',
  })
  @IsString()
  @IsNotEmpty({ message: '手机号不能为空' })
  @MinLength(11, { message: '手机号长度必须为11位' })
  @MaxLength(11, { message: '手机号长度不能超过11位' })
  readonly phoneNumber: string;

  @ApiProperty({
  description: '用户姓名',
  example: '张三',
  type: String,
  required: true,
  maxLength: 50,
  minLength: 1,
  nullable: false,
  default: '张三',
  })
  name: string;

  @ApiProperty({
    description: '用户邮箱',
    example: '1@163.com',
    type: String,
    required: true,
    maxLength: 100,
    minLength: 5,
    nullable: false,
    default: '1@163.com',
    format: 'email', // 确保是有效的邮箱格式
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', // 邮箱正则表达式
    title: 'Email Address',
    uniqueItems: true, // 确保邮箱唯一 
    })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({
    description: '用户密码',
    example: 'password123',
    type: String,
    required: true,
    minLength: 6,
    maxLength: 20,
    nullable: false,
    default: 'password123',
    format: 'password', // 自定义格式
    title: 'Password',
  })
  @IsNotEmpty({ message: '密码不能为空' })
  @IsString()
  @MinLength(6, { message: '密码长度不能少于6位' })
  @MaxLength(20, { message: '密码长度不能超过20位' })
  password: string;
}
