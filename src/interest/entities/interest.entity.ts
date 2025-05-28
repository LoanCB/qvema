import { TimestampEntity } from '@src/common/entities/timestamp.entity';
import { User } from '@src/user/entities/user.entity';
import { Column, Entity, ManyToMany, Relation } from 'typeorm';

@Entity()
export class Interest extends TimestampEntity {
  @Column({ unique: true })
  name: string;

  @Column({ type: 'character varying', nullable: true })
  description?: string | null;

  @ManyToMany(() => User, (user) => user.interests)
  users: Relation<User>[];
}
