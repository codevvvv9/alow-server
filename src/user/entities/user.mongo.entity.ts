import { CommonEntity } from 'src/shared/entities/common.entity';
import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class User extends CommonEntity {

  @Column('text')
  name: string;

  @Column({
    length: 100,
  })
  email: string;

  // 加密相关
  @Column('text')
  password: string;

  @Column({
    type: 'text',
    select: false, // 不在查询中返回此字段
  })
  salt: string;
}
