import {
  Column,
  CreateDateColumn,
  ObjectId,
  ObjectIdColumn,
  VersionColumn,
} from 'typeorm';

export abstract class CommonEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column({
    default: false,
    select: false, // 不在查询中默认返回
    comment: '逻辑删除标志，true表示已删除，false表示未删除',
  })
  isDeleted: boolean;

  // 版本号，乐观锁控制
  @VersionColumn({
    default: 0.1,
    select: false, // 不在查询中默认返回
    comment: '乐观锁版本号',
  })
  version: number;

  @Column()
  thumbnail: string;
}
