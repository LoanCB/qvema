import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class TimestampEntity extends BaseEntity {
  @ApiProperty({ example: '2025-01-01T08:00:00.303Z' })
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-20T10:00:00.303Z' })
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
