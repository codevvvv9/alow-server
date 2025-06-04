import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty({
    description: '用户名',
    example: 'admin',
  })
  readonly name: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @ApiProperty({
    description: '密码',
    example: 'admin',
  })
  readonly password: string;

  sessionId?: string; // 可选的会话ID，用于跟踪用户会话
}

export class RegisterSMSDTO {

    /**
     * 手机号（系统唯一）
     */
    // @Matches(regMobileCN, { message: '请输入正确手机号' })
    @IsNotEmpty({ message: '请输入手机号' })
    @ApiProperty({ example: '13611177420' })
    readonly phoneNumber: string;

    /**
     * 短信验证码
     */
    @IsNotEmpty({ message: '请输入验证码' })
    @ApiProperty({ example: '0000' })
    readonly smsCode: string;

}

export class RegisterCodeDTO {

    /**
     * 手机号（系统唯一）
     */
    // @Matches(regMobileCN, { message: '请输入正确手机号' })
    @IsNotEmpty({ message: '请输入手机号' })
    @ApiProperty({ example: '13611177420' })
    readonly phoneNumber: string;

    @IsNotEmpty({ message: '请输入验证码ID' })
    @ApiProperty({ example: 'GaBUGhJzESU=' })
    readonly captchaId: string;

    @IsNotEmpty({ message: '请输入验证码' })
    @ApiProperty({ example: '0000' })
    readonly captchaCode: string;

}

export class RegisterDTO {

    /**
     * 用户名
     */
    @IsNotEmpty({ message: '请输入用户昵称' })
    @IsString({ message: '名字必须是 String 类型' })
    @ApiProperty({ example: "小名" })
    readonly name: string;

    /**
     * 用户密码
     */
    @IsNotEmpty({ message: '请输入密码' })
    @ApiProperty({ example: '888888' })
    readonly password: string;
}

export class UserInfoDto {

    @ApiProperty({ example: '小明' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    password?: string;

    salt?: string; // 可选的盐值，用于密码加密
    email?: string; // 可选的邮箱地址

}