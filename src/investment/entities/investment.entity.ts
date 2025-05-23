import { Project } from '@src/project/entities/project.entity';
import { User } from '@src/user/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  investorId: number;

  @Column()
  projectId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  date: Date;

  @ManyToOne(() => User)
  investor: User;

  @ManyToOne(() => Project)
  project: Project;

  @UpdateDateColumn()
  updatedAt: Date;
}
