import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseEntity {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
