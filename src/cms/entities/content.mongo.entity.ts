import { CommonEntity } from "@/shared/entities/common.entity";
import { Column, Entity, ObjectId, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Content extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  title: string

  @Column('text')
  content: string;

  @Column('text')
  type: string;

  //!加上 @ObjectIdColumn() 会把这个字段变成 _id主键的值
  // @ObjectIdColumn()
  @Column('text')
  userId?: ObjectId

  @Column('boolean')
  publish: boolean
}
