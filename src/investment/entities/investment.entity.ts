import { TimestampEntity } from '@src/common/entities/timestamp.entity';
import { Project } from '@src/project/entities/project.entity';
import { User } from '@src/user/entities/user.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

@Entity()
export class Investment extends TimestampEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => User, (user) => user.id)
  investor: Relation<User>;

  @Column()
  investorId: string;

  @ManyToOne(() => Project, (project) => project.id)
  project: Relation<Project>;

  @Column()
  projectId: string;
}
