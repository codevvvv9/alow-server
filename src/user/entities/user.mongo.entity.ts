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
}
