import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET
    })
  }
  // JWT 认证守卫 (JwtAuthGuard) 在验证 token 时，
  // 会将解析出的用户信息附加到 request 对象上。
  async validate(payload: any): Promise<any> {
    console.log('jwt validate payload === ', payload);
    
    return {
      // 这里的返回值会被添加到 req.user 中
      // 也就是 @Req()req中有 req.user.id
      id: payload.id
    }
  }
}