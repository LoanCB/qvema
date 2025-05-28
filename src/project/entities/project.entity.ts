import { TimestampEntity } from '@src/common/entities/timestamp.entity';
import { User } from '@src/user/entities/user.entity';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

export enum ProjectCategory {
  TECHNOLOGY = 'TECHNOLOGY',
  HEALTHCARE = 'HEALTHCARE',
  EDUCATION = 'EDUCATION',
  FINANCE = 'FINANCE',
  REAL_ESTATE = 'REAL_ESTATE',
  OTHER = 'OTHER',
}

@Entity()
export class Project extends TimestampEntity {
  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  budget: number;

  @Column({
    type: 'enum',
    enum: ProjectCategory,
    default: ProjectCategory.OTHER,
  })
  category: ProjectCategory;

  @ManyToOne(() => User, (user) => user.id)
  owner: Relation<User>;

  @Column()
  ownerId: string;
}
